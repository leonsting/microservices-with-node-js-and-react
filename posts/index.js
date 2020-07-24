const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let posts = {};

app.get("/posts", (_, res) => {
  res.send(posts);
});

app.post("/post", (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };
  console.log(posts, req.body);
  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log("Listen posts service at ⛩️ :: 4000 ");
});
