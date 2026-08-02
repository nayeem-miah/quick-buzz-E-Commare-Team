require("dotenv").config();
const { client, connectDB } = require("./src/config/db");
const { ObjectId } = require("mongodb");

(async () => {
    await connectDB();
    const db = client.db("quickBuzz");

    const oldHost = "quick.buzz@gmail.com";
    const newHost = "user.quickbuzz@gmail.com";

    // 1. Reassign order items belonging to this host (all orders, to keep consistency)
    const itemResult = await db.collection("order_items").updateMany(
        { hostEmail: oldHost },
        { $set: { hostEmail: newHost } }
    );
    console.log("order_items updated:", itemResult.modifiedCount);

    // 2. Reassign products owned by this host
    const productResult = await db.collection("allProducts").updateMany(
        { hostEmail: oldHost },
        { $set: { hostEmail: newHost } }
    );
    console.log("products updated:", productResult.modifiedCount);

    const remaining = await db.collection("order_items").countDocuments({ hostEmail: oldHost });
    console.log("order_items still under old host:", remaining);

    await client.close();
    process.exit(0);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
