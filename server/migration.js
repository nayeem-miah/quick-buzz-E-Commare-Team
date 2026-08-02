const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const validCategories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Books",
  "Toys",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Groceries",
  "Automotive",
  "Pet Supplies"
];

// Simple keyword matcher mapping keywords to categories
const keywordMapping = {
  "laptop": "Electronics",
  "phone": "Electronics",
  "mobile": "Electronics",
  "pc": "Electronics",
  "mouse": "Electronics",
  "keyboard": "Electronics",
  "earphone": "Electronics",
  "airpods": "Electronics",
  "cable": "Electronics",
  "charger": "Electronics",
  "usb": "Electronics",
  "drive": "Electronics",
  "shirt": "Clothing",
  "pant": "Clothing",
  "shoe": "Clothing",
  "dress": "Clothing",
  "bag": "Clothing",
  "toy": "Toys",
  "book": "Books",
  "kitchen": "Home & Kitchen",
  "home": "Home & Kitchen",
  "car": "Automotive",
  "auto": "Automotive",
  "food": "Groceries",
  "grocery": "Groceries",
  "beauty": "Beauty & Personal Care",
  "makeup": "Beauty & Personal Care",
  "sport": "Sports & Outdoors",
  "pet": "Pet Supplies",
  "dog": "Pet Supplies",
  "cat": "Pet Supplies"
};

function assignCategory(title, currentCategory) {
    const searchString = `${title} ${currentCategory}`.toLowerCase();
    
    // Check keywords
    for (const [keyword, category] of Object.entries(keywordMapping)) {
        if (searchString.includes(keyword)) {
            return category;
        }
    }
    
    // Exact match if the current category is already one of the valid ones
    if (validCategories.includes(currentCategory)) {
        return currentCategory;
    }
    
    // Default fallback
    return "Electronics"; 
}

async function run() {
    // using the DB URI directly from .env or fallback
    const uri = process.env.MONGO_URI || "mongodb+srv://quickBus:RFrYRoNAQFcByUUL@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority";
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    try {
        await client.connect();
        console.log("Connected to DB...");
        
        const db = client.db("quickBuzz");
        const productsCol = db.collection("allProducts");
        
        const products = await productsCol.find({}).toArray();
        console.log(`Found ${products.length} products to migrate.`);
        
        let updatedCount = 0;
        for (const product of products) {
            const newCat = assignCategory(product.productTitle || "", product.category || "");
            
            // update if changed or if we just want to force a clean valid string
            if (product.category !== newCat) {
                await productsCol.updateOne(
                    { _id: product._id },
                    { $set: { category: newCat } }
                );
                updatedCount++;
                console.log(`Migrated product: "${product.productTitle}" from '${product.category}' to '${newCat}'`);
            }
        }
        console.log(`Migration Complete. Updated ${updatedCount} products.`);
    } catch (error) {
        console.error("Migration Error:", error);
    } finally {
        await client.close();
    }
}

run();
