require("dotenv").config();
const { client, connectDB } = require("./src/config/db");

(async () => {
    await connectDB();
    const db = client.db("quickBuzz");
    const r = await db.collection("alluser").updateOne(
        { email: "user.quickbuzz@gmail.com" },
        { $set: { role: "host" } }
    );
    console.log("matched:", r.matchedCount, "modified:", r.modifiedCount);
    const u = await db.collection("alluser").findOne({ email: "user.quickbuzz@gmail.com" });
    console.log("new role:", u.role);
    await client.close();
    process.exit(0);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
