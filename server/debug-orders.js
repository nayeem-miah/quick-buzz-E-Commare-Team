require("dotenv").config();
const { client, connectDB } = require("./src/config/db");

(async () => {
    await connectDB();
    const db = client.db("quickBuzz");
    const hostEmail = "user.quickbuzz@gmail.com";

    const payments = await db.collection("payments").find().sort({ _id: -1 }).limit(5).toArray();
    console.log("=== payments (last 5) ===");
    for (const p of payments) {
        console.log({
            _id: String(p._id),
            order_id: String(p.order_id),
            order_id_type: typeof p.order_id,
            cus_email: p.cus_email,
            method: p.payment_method,
            status: p.status,
            hasHostEmail: !!p.hostEmail,
        });
    }

    const orderItems = await db.collection("order_items").find().sort({ _id: -1 }).limit(10).toArray();
    console.log("\n=== order_items (last 10) ===");
    for (const o of orderItems) {
        console.log({
            order_id: String(o.order_id),
            order_id_type: typeof o.order_id,
            hostEmail: o.hostEmail,
            title: o.productTitle,
            status: o.status,
        });
    }

    const orders = await db.collection("orders").find().sort({ _id: -1 }).limit(5).toArray();
    console.log("\n=== orders (last 5) ===");
    for (const o of orders) {
        console.log({ _id: String(o._id), email: o.email, status: o.status, total: o.total_amount });
    }

    await client.close();
    process.exit(0);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
