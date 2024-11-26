const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import MongoClient and ServerApiVersion
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection string
// const uri='mongodb://localhost:27017'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("quickBuzz").collection("alluser");
    const productsCollection = client.db("quickBuzz").collection("allProducts");


    // add product in db
    app.post('/product', async(req, res)=>{
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct)
      res.send(result)
    })
    // get all products in admin dashboard
    app.get('/products', async(req, res)=>{
      const result = await productsCollection.find().toArray()
      res.send(result)
    })
    // get all product in host or email ways
  app.get('/host-product/:email', async(req, res)=>{
    const email = req.params.email;
    const query = {hostEmail: email};
    const result = await productsCollection.find(query).toArray();
    res.send(result);
  })
    // admin is approved host products
    app.patch('/admin-product/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const updatedDoc ={
        $set:{
          adminIsApproved: "approve",
        }
      }
      const result = await productsCollection.updateOne(filter, updatedDoc);
      res.send(result)
    })


    // delete product 
    app.delete('/pro/:id', async(req, res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await productsCollection.deleteOne(query)
      res.send(result);
    })


    // details page is start 
       // Get a single room data from db using _id

       app.get('/product/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.findOne(query)
        res.send(result)
       })


      // get all users
      app.get('/alluser', async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result)
        // console.log(result);
        
    })
  
    app.get("/single-user/:email", async (req, res) => {
      const { email } = req.params;
        //  console.log('all data is a ohk ',email);
      const user = await userCollection.findOne({ email })
      if (!user) {
          return res.status(404).send({ error: "User not found with this email" });
      }
      res.status(200).send(user)
      // console.log(user);
      
  })
  
   
    //  post all data 
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
      });
  
  
        // patch all user
    app.patch('/alluser/admin/:id', async (req, res) => {
      const { role } = req.body;
      const id = req.params.id;
      // console.log(role);
      
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
          $set: {
              role: role,
          }
      };
      try {
          const result = await userCollection.updateOne(filter, updatedDoc);
          res.send(result);
      } catch (error) {
          res.status(500).send({ message: 'Failed to update role', error });
      }
  });
    // await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
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
  console.log(`Server is running on http://localhost:${PORT}`);
});
