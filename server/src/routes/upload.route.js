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

module.exports = router;
