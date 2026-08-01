require("dotenv").config();
const { client, connectDB } = require("./src/config/db");

const collectionsToClear = [
    { name: "orders", ref: "OrderCollection" },
    { name: "order_items", ref: "OrderItemCollection" },
    { name: "payments", ref: "PaymentCollection" },
    { name: "order_status_history", ref: "OrderStatusHistoryCollection" },
    { name: "host_wallets", ref: "HostWalletCollection" },
];

const run = async () => {
    await connectDB();
    const { module } = await import("./src/module/module.js");
    const db = client.db("quickBuzz");

    console.log("=== Order-related data cleanup ===\n");

    for (const col of collectionsToClear) {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        if (count > 0) {
            await collection.deleteMany({});
            console.log(`[DELETED] ${col.name} — ${count} document(s)`);
        } else {
            console.log(`[SKIPPED] ${col.name} — already empty`);
        }
    }

    console.log("\nCleanup complete ✔");
    await client.close();
    process.exit(0);
};

run().catch((err) => {
    console.error("Cleanup failed ❌", err);
    process.exit(1);
});
