const { client } = require("../config/db");


const db = client.db("quickBuzz");

module.exports = {
    UserCollection: db.collection("alluser"),
    ProductCollection: db.collection("allProducts"),
    WishlistCollection: db.collection("allsave"),
    CartCollection: db.collection("carts"),
    OrderCollection: db.collection("orders"),
    OrderItemCollection: db.collection("order_items"),
    PaymentCollection: db.collection("payments"),
    ReviewCollection: db.collection("reviews"),
    SellerCollection: db.collection("sellerRequest"),
    CategoryCollection: db.collection("categories"),
    NotificationCollection: db.collection("notifications"),
};
