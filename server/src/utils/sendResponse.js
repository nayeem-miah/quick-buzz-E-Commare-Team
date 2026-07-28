const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || "",
        data: data.data || null
    });
};

module.exports = sendResponse;