const jwt = require("jsonwebtoken");
const { UserCollection } = require("../module/module");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");


const verifyToken = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(401, "unauthorized access");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "default_secret", (err, decoded) => {
        if (err) {
            return next(new AppError(403, "forbidden access"));
        }
        req.user = decoded;
        next();
    });
});


const verifyAdmin = catchAsync(async (req, res, next) => {
    const email = req.user?.email;
    const user = await UserCollection.findOne({ email });

    if (!user || user.role?.toLowerCase() !== "admin") {
        throw new AppError(403, "forbidden access (admin only)");
    }

    next();
});


const verifyHost = catchAsync(async (req, res, next) => {
    const email = req.user?.email;
    const user = await UserCollection.findOne({ email });

    const role = user?.role?.toLowerCase();
    if (!user || (role !== "seller" && role !== "host")) {
        throw new AppError(403, "forbidden access (host only)");
    }

    next();
});

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyHost
};
