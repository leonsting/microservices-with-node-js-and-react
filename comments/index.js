const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.status(200).send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comment", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const commentId = randomBytes(4).toString("hex");
  let comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[id] = comments;
  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listen comments service at ⛩️ :: 4001");
});
