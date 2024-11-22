const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose'); // Mongoose import
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority`;

// Mongoose দিয়ে ডাটাবেস সংযোগ স্থাপন
mongoose
  .connect(uri) // No need for deprecated options
  .then(() => {
    console.log('Connected to MongoDB using Mongoose!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Example Schema এবং Model তৈরি
const exampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const ExampleModel = mongoose.model('Example', exampleSchema);

// Example Route
app.post('/example', async (req, res) => {
  try {
    const exampleData = new ExampleModel(req.body);
    const savedData = await exampleData.save();
    res.status(201).send(savedData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

async function run() {
  try {
    // const userCollection=
    // await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


// Root route
app.get('/', (req, res) => {
  res.send('Hello from the our website!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





