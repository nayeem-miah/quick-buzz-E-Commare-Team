const axios = require("axios");
const { ProductCollection } = require("../module/module");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");
const AppError = require("../utils/AppError");
const config = require("../config");

const handleAiChat = catchAsync(async (req, res) => {
    const { message } = req.body;
    if (!message) {
        throw new AppError(400, "Message is required");
    }

    let products = [];
    try {
        products = await ProductCollection.find(
            { adminIsApproved: "approve" },
            {
                projection: {
                    productTitle: 1,
                    price: 1,
                    brandName: 1,
                    category: 1,
                    _id: 1
                }
            }
        ).limit(10).toArray();
    } catch (dbError) {
        throw new AppError(500, `Database error fetching products: ${dbError.message}`);
    }

    // Build product context
    let productContext = "Here is a list of active products currently available on our QuickBuzz store:\n";
    if (products.length > 0) {
        products.forEach((p) => {
            productContext += `- Title: ${p.productTitle}, Price: ৳${p.price || 0}, Brand: ${p.brandName || "Generic"}, Category: ${p.category}, Link: /product/${p._id}\n`;
        });
    } else {
        productContext += "No active products are currently indexed in the catalog.\n";
    }

    // Construct Gemini prompt
    const prompt = `You are a helpful, extremely polite, and concise shopping assistant for the QuickBuzz e-commerce website.
Your main job is to answer questions, guide users, and recommend products from the store.
Only suggest products from the following list:
${productContext}

Remember: Always keep your replies short, natural, friendly, and direct. When providing a link to a product, output it exactly like this: [Product Title](/product/PRODUCT_ID). Do not use external URLs.

User Message: "${message}"`;

    const apiKey = config.geminiApiKey;
    if (!apiKey) {
        throw new AppError(500, "Gemini API key is not configured on the server.");
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't formulate a suggestion right now. Please try again soon.";

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "AI recommendation fetched successfully",
            data: {
                reply: replyText
            }
        });
    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error("Gemini API Request failed:", errMsg);

        let userFriendlyReply = "I am having trouble connecting to my AI brain. Please try again soon!";
        if (
            errMsg.toLowerCase().includes("api key") || 
            errMsg.toLowerCase().includes("not found") || 
            errMsg.toLowerCase().includes("not supported")
        ) {
            userFriendlyReply = "Hi! It looks like the configured GEMINI_API_KEY in the server's `.env` file is invalid or not active. Please create a valid key from Google AI Studio (starting with 'AIzaSy') and save it to `.env` to start chatting! 🚀";
        }

        sendResponse(res, {
            statusCode: 200,
            success: false,
            message: `Gemini API Request failed: ${errMsg}`,
            data: {
                reply: userFriendlyReply
            }
        });
    }
});

module.exports = {
    handleAiChat
};
