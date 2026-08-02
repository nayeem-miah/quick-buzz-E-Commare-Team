const express = require("express");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const sendResponse = require("../utils/sendResponse");
const router = express.Router();

router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No image file provided"
    });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "quickbuzz" },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Image upload failed"
        });
      }
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Image uploaded successfully",
        data: {
          display_url: result.secure_url,
        }
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

router.post("/images", upload.array("images", 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No image files provided",
    });
  }

  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "quickbuzz" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error for a file:", error);
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const displayUrls = await Promise.all(uploadPromises);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Images uploaded successfully",
      data: {
        display_urls: displayUrls,
      },
    });
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Image upload failed",
    });
  }
});
module.exports = router;
