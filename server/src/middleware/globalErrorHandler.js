const globalErrorHandler = (err, req, res, next) => {
    console.log("🔥 Global Error:", err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

module.exports = globalErrorHandler;
