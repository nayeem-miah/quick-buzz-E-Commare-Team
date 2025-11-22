require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");


const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
