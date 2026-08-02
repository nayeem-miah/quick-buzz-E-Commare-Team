require("dotenv").config();
const { client, connectDB } = require("./src/config/db");

(async () => {
    await connectDB();
    const db = client.db("quickBuzz");
    const hostEmail = "user.quickbuzz@gmail.com";
    const r = await db.collection("payments").aggregate([
        {
            $lookup: {
                from: "order_items",
                localField: "order_id",
                foreignField: "order_id",
                as: "orderItems",
            },
        },
        {
            $match: {
                $or: [{ hostEmail }, { "orderItems.hostEmail": hostEmail }],
            },
        },
    ]).toArray();
    console.log("host-visible payments:", r.length);
    for (const p of r) {
        console.log({
            order_id: String(p.order_id),
            method: p.payment_method,
            items: (p.orderItems || []).map((i) => i.productTitle),
        });
    }
    await client.close();
    process.exit(0);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
