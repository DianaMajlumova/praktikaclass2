const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const { json } = require("body-parser");

dotenv.config();
const app = express();

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Users = mongoose.model("users", userSchema);

app.use(cors());
app.use(bodyParser.json());

//GetAllUser
app.get("/users", (req, res) => {
  Users.find({}, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.status(404).json({ message: err });
    }
  });
});
//GetUserById
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  Users.findById(id, (err, doc) => {
    if (!err) {
      if (doc) {
        res.send(doc);
        res.status(200);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    }
  });
});

//Delete
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  Users.findByIdAndDelete(id, (err, doc) => {
    if (!err) {
      res.send("Deleted");
    } else {
      res.status(404).json({ message: err });
    }
  });
});

//Add user
app.post("/users", (req, res) => {
  let user = new Users({
    imageUrl: req.body.imageUrl,
    title: req.body.title,
    description: req.body.description,
  });
  user.save();
  res.send({ message: "Success" });
});

//Update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  Users.findByIdAndUpdate(id, (err, doc) => {
    if (!err) {
      res.status(201);
    } else {
      res.status(404).json({ message: err });
    }
  });
  res.send({ message: "Successfully" });
});

app.get("/", (req, res) => {
  res.send("<h1>HELLO</h1>");
});

const PORT = process.env.PORT;
const url = process.env.CONNECTION_URL.replace(
  "<password>",
  process.env.PASSWORD
);

mongoose.set("strictQuery", true);
mongoose.connect(url, (err) => {
  if (!err) {
    console.log("DB Connect");
    app.listen(PORT, () => {
      console.log("Start server");
    });
  }
});
