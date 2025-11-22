const { client } = require("../config/db");


const db = client.db("quickBuzz");

module.exports = {
    UserCollection: db.collection("alluser"),
    ProductCollection: db.collection("allProducts"),
    WishlistCollection: db.collection("allsave"),
    PaymentCollection: db.collection("allpayment"),
    ReviewCollection: db.collection("reviews"),
    SellerCollection: db.collection("sellerRequest"),
};
