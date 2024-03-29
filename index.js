require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjdqp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// Middleware to set caching headers
// app.use((req, res, next) => {
//   res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
//   next();
// });
app.set("etag", false);
app.use(express.static("public", { maxAge: 31536000 }));
const run = async () => {
  try {
    const db = client.db("go-zayaan");
    const courseCollection = db.collection("courses");

    app.get("/courses", async (req, res) => {
      const cursor = courseCollection.find({});
      const courses = await cursor.toArray();

      res.send(courses);
    });

    app.post("/courses", async (req, res) => {
      const courses = req.body;
      const result = await courseCollection.insertOne(courses);
      res.send(result);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const result = await courseCollection.findOne({ id });
      res.send(result);
    });

    app.delete("/courses/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const result = await courseCollection.deleteOne({ id });
      console.log(result);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
