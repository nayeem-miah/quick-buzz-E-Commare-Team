const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb"); // Import MongoClient and ServerApiVersion
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

 const userCollection = client.db("quickBuzz").collection("alluser");

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();


    app.post("/users", async (req, res) => {
      // console.log("Request received for /users:", req.body); 
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log('all data is a ohk ',result);
      
    });
    






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Hello from the website!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
