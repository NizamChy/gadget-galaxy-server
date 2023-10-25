// backend database index.js filemidleware

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

// ------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s9fb7y.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // creating database for cart item collection
    const cartItemCollection = client.db("cartItemDB").collection("mycart");

    app.get("/mycart", async (req, res) => {
      const cursor = cartItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/mycart", async (req, res) => {
      const cartItem = req.body;
      console.log(cartItem);
      const result = await cartItemCollection.insertOne(cartItem);
      res.send(result);
    });

    app.delete("/mycart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await cartItemCollection.deleteOne(query);
      res.send(result);
    });

    const productCollection = client.db("productDB").collection("product");
    const userCollection = client.db("productDB").collection("user");

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedProduct = req.body;

      const product = {
        $set: {
          name: updatedProduct.name,
          image: updatedProduct.image,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // user apis
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      console.log(users);
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const { brand } = req.query;

      // Fetch products filtered by brand from the database
      const products = await productCollection.find({ brand }).toArray();
      res.send(products);
    });

    // Send a ping to confirm a successful connection

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// -------------------------------

app.get("/", (req, res) => {
  res.send("Brand Shop server is running");
});

app.listen(port, () => {
  console.log(`Brand Shop server is running on port: ${port}`);
});git 
