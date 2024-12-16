const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import MongoClient and ServerApiVersion
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


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
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false; //true for live, false for sandbox
async function run() {
  try {
    const userCollection = client.db("quickBuzz").collection("alluser");
    const productsCollection = client.db("quickBuzz").collection("allProducts");
    const wishlistCollection = client.db("quickBuzz").collection("allsave");
    const successPaymentCollection = client.db("quickBuzz").collection("allpayment");
    const reviewtCollection = client.db("quickBuzz").collection("reviews");
    const becomeSellerCollection = client
      .db("quickBuzz")
      .collection("sellerRequest");

    // add product in db
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // get all products in admin dashboard
    // get all rooms
    app.get("/products", async (req, res) => {
      try {
        const { category } = req.query;

        let query = {};
        if (category && category !== "all" && category !== "null") {
          query = { category };
        }
        // console.log("Query for products:", query);
        const result = await productsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ error: "Failed to fetch products" });
      }
    });

    // get all product in host or email ways
    app.get("/host-product/:email", async (req, res) => {
      const email = req.params.email;
      const query = { hostEmail: email };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    // admin is approved host products
    app.patch("/admin-product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          adminIsApproved: "approve",
        },
      };
      const result = await productsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    /* user deleted data  */

    app.delete("/userpro/:id", async (req, res) => {
      const id = req.params.id;

      // Validate the ID format to ensure it matches ObjectId format
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
      }

      // console.log("Deleting ID:", id);

      const query = { _id: new ObjectId(id) };
      try {
        const result = await wishlistCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          console.log("No item found to delete with ID:", id);
          return res.status(404).send({ error: "Item not found" });
        }

        // console.log("Successfully deleted item with ID:", id);
        res.send(result);
      } catch (error) {
        console.error("Error deleting item:", error.message);
        res.status(500).send({ error: "Failed to delete the item" });
      }
    });

    // delete product
    app.delete("/pro/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // details page is start
    // Get a single room data from db using _id
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    }); 

    // recent product show in home page and search implement
    app.get('/recent-product', async (req, res) => {
      try {
        const search = req.query.search || "";
        const query = {
          $or: [
            { productTitle: { $regex: search, $options: "i" } },
            { brandName: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        };
    
        const result = await productsCollection
          .find(query)
          .limit(20)
          .sort({ createAt: -1 })
          .toArray();
    
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ err: "Failed to perform search" });
      }
    });
    


    // save data get with mongodb 
     app.get('/allsave', async (req, res) => {
       const result = await wishlistCollection.find().toArray()
       res.send(result)
    })


    

  //  single user by data 
  app.get('/allsave/:email', async (req, res)=>{
    const email = req.params.email;
    if(email){
    query = { email: email}
    const result = await wishlistCollection.find(query).toArray();
    res.send(result)
    }
  })






    // save data get with mongodb
    app.get("/allsave", async (req, res) => {
      const result = await wishlistCollection.find().toArray();
      res.send(result);
    });
    

    //  single user by data
    app.get("/allsave/:email", async (req, res) => {
      const email = req.params.email;
      if (email) {
        query = { email: email };
        const result = await wishlistCollection.find(query).toArray();
        res.send(result);
      }
    });

    //  update single data
    app.patch("/product-update/:id", async (req, res) => {
      const productData = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          productTitle: productData.productTitle,
          brandName: productData.brandName,
          price: productData.price,
          discount: productData.discount,
          tags: productData.tags,
          category: productData.category,
          description: productData?.description,
          productImage: productData.productImage,
          hostEmail: productData?.hostEmail,
          hostName: productData?.hostName,
          hostPhoto: productData?.hostPhoto,
          adminIsApproved: productData.adminIsApproved,
        },
      };
      const result = await productsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // get all users
    app.get("/alluser", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
      // console.log(result);
    });

    // delete user
    app.delete("/alluser/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/single-user/:email", async (req, res) => {
      const { email } = req.params;
      const user = await userCollection.findOne({ email });
      if (!user) {
        // console.log("User not found for email:", email); // Debugging
        return res
          .status(404)
          .send({ error: "User not found with this email" });
      }
      res.status(200).send(user);
    });

    /* wishlist data save with mongodb  */
    app.post("/allsave", async (req, res) => {
      try {
        const wishlist = req.body;

        // `_id` মুছে দিন
        // console.log("Before deleting _id:", wishlist);
        delete wishlist._id;
        // console.log("After deleting _id:", wishlist);

        if (!wishlist || Object.keys(wishlist).length === 0) {
          return res.status(400).send({ error: "Invalid wishlist data." });
        }

        // ইনসার্ট অপারেশন
        const result = await wishlistCollection.insertOne(wishlist);

        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting wishlist:", error);
        res.status(500).send({ error: "Failed to save wishlist." });
      }
    });

    //  post all user
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

  


    
/* Review post  */
app.post('/reviews', async (req, res) => {
  const review = req.body;
  // console.log("Received review data:", review); // রিকোয়েস্টে প্রাপ্ত ডাটা লগ করা
  try {
      const result = await reviewtCollection.insertOne(review); // ডাটাবেসে নতুন রিভিউ যোগ করা
      // console.log("Review successfully saved:", result); // সফল ইনসার্ট লগ করা
      res.status(201).send(result); 
  } catch (error) {
      console.error("Error saving review:", error.message); // ত্রুটির বার্তা লগ করা
      console.error("Full error details:", error); // পুরো ত্রুটি লগ করা
      res.status(500).send({ message: "Failed to save review" }); // ত্রুটির রেসপন্স
  }
});

 


/* Get a Review data:id  */
app.get('/review/:id', async (req, res) => {
  const productid = req.params.id; 
  try {
    const query = { productid: productid };
    const result = await reviewtCollection
      .find(query)
      .sort({ createdAt: -1 })  
      .toArray();

    // console.log(result);  
    res.send(result);  
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });  
  }
});




/* Get a Review data  */
app.get('/review', async (req, res) => {

  try {
      const result = await reviewtCollection.find().toArray();
      // console.log(result);  
      res.send(result);  
  } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).send({ message: "Failed to fetch reviews" });  
  }
});





    // patch all user
    app.patch("/alluser/admin/:id", async (req, res) => {
      const { role } = req.body;
      const id = req.params.id;
      // console.log(role);

      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: role,
        },
      };
      try {
        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update role", error });
      }
    });

    // become a seller post in db ------------
    app.post("/seller", async (req, res) => {
      try {
        const seller = req.body;
        const query = { sellerEmail: seller.sellerEmail };
        const existingUser = await becomeSellerCollection.findOne(query);
        if (existingUser) {
          return res.send({
            message: "seller already exist",
            insertedId: null,
          });
        }
        const result = await becomeSellerCollection.insertOne(seller);
        res.send(result);
      } catch (err) {
        console.err(err.message);
      }
    });

    //  get all data in seller
    app.get("/seller", async (req, res) => {
      try {
        const result = await becomeSellerCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.error(err);
      }
    });

    // get id seller
    app.get("/sell/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await becomeSellerCollection.findOne(query);
      res.send(result);
    }); 
// decline message
app.patch("/decline-message/:id", async(req, res)=>{
  try{
    const declineMessage= req.body;
  const id = req.params.id;
  const filter = { _id: new ObjectId(id)}
  console.log(declineMessage);
  const updatedDoc = {
    $set:{
      decline: declineMessage.inputValue
    }
  }
  const result = await becomeSellerCollection.updateOne(filter, updatedDoc)
  res.send(result)
  }catch(err){
    console.error(err);
    res.status(500).send({message: "failed decline message"})
  }
})

    //  get seller data in email ways
    app.get("/single-seller/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { sellerEmail: email };
        const result = await becomeSellerCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.error(err);
      }
    });

    // delete single seller
    app.delete("/delete-seller/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await becomeSellerCollection.deleteOne(query);
      res.send(result);
    });

    // single data updated
    app.patch('/seller-updated/:id', async(req, res)=>{
     try{
      const sellerData = req.body;
      const id = req.params.id;
     const filter = { _id: new ObjectId(id) };
     const updatedDoc = {
      $set:{
        sellerName: sellerData.sellerName,
        mobile: sellerData.mobile,
        other: sellerData.other,
        address: sellerData.address,
        reason: sellerData.reason,
        imageUrl: sellerData.imageUrl
      }
     } 
     const result = await becomeSellerCollection.updateOne(filter, updatedDoc)
     res.send(result)
     }catch(err){
      console.error(err)
      res.status(500).send({message: "does'n updated success"})
      
     }
    })

   // -----------------------ssl commarze start----------------
    //1.init payment
    //2.post Request---url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    //3.0 then  success payment post request
    // 3.2 save data in database
    // 4. if payment success and then update database
    // 5. if payment is not success and fail
    // sslCommarze create payment-------------------------------
    const date = new Date().toLocaleDateString();
    
    
    app.post('/create-payment', async(req, res)=>{
      const paymentInfo= req.body;
     const  {totalPrice, email,displayName,multiProductTitle,multiProductBrandName,multiProductHostEmail,multiProductImg,multiProductDescription}= paymentInfo;
      
// init data
      const trxId = new ObjectId().toString();
      const intentData = {
        store_id,
        store_passwd,
        total_amount: totalPrice,
        currency: paymentInfo?.currency || "BDT",
        tran_id: trxId,
        success_url: "http://localhost:3000/success-payment",
        fail_url: "http://localhost:3000/fail",
        cancel_url: "http://localhost:3000/cancel",
        emi_option: 0,
        cus_name: displayName,
        cus_email: email,
        cus_add1: "Address Line 1",
        cus_city: "City",
        cus_postcode: "1234",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        shipping_method: "NO",
        product_name: multiProductTitle,
        product_category: "General",
        product_brandName: multiProductBrandName,
        product_profile: "general",
      };
      // post request
      const response = await axios({
        method: "POST",
        url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        data: intentData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // console.log(response.data.GatewayPageURL, "response");
      // sava data in db
      const savaData ={
        cus_name: displayName,
        cus_email: email,
        productTitle: multiProductTitle,
        brandName: multiProductBrandName,
        productImage: multiProductImg,
        description: multiProductDescription,
        date:date,
        totalPrice:totalPrice,
        currency:  "BDT",
        transactionId: trxId,
        hostEmail: multiProductHostEmail,
        status: "pending",
      }
      const result = await successPaymentCollection.insertOne(savaData)
      // result response frontend
      // console.log(result, "result is");
      if (result) {
        res.send({
          paymentUrl: response.data.GatewayPageURL,
        });
      }
    })
     // success-payment
     app.post("/success-payment", async (req, res) => {
      const successData = req.body;
      // console.log(successData, "success data");
      if (successData.status !== "VALID") {
        throw new Error("unauthorize payment , invalid payment");
      }
      // update the database
      const query = {
        transactionId: successData.tran_id,
      };
      const update = {
        $set: {
          status: "success",
          tran_date: successData.tran_date,
          card_type: successData.card_type,
          hostIsApproved: "pending",
        },
      };
      const updateData = await successPaymentCollection.updateOne(
        query,
        update
      );
      // console.log(updateData, "update data");
      res.redirect("http://localhost:5173/success");
    });
     // Fail-payment
     app.post("/fail", async (req, res) => {
      // rediect in fronend
      res.redirect("http://localhost:5173/fail");
    });
     // cancle-payment
     app.post("/cancel", async (req, res) => {
      // rediect in fronend
      res.redirect("http://localhost:5173/cancel");
    });
  
    // ------------end ssl commarce-----------------------

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
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
