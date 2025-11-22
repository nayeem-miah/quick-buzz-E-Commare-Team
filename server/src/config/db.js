const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB Connected ✔");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
    }
}

module.exports = { client, connectDB };
