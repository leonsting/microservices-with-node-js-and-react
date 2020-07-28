const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const EVENT_BUS_URL = "http://localhost:4005/events";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const { id } = req.params;
    res.status(200).send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const commentId = randomBytes(4).toString("hex");
    let comments = commentsByPostId[id] || [];
    const newComment = {
        id: commentId,
        content,
        postId: id,
        status: "pending",
    };
    comments.push(newComment);
    commentsByPostId[id] = comments;
    const event = {
        type: "CommentCreated",
        data: newComment,
    };
    console.log("=======> Sent event 🛸 to Event bus ", event);
    await axios.post(EVENT_BUS_URL, event);
    res.status(201).send(comments);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    switch (type) {
        case "ConmmentModerated": {
            console.log("<======== Recieve event 🛸 :: ", req.body);
            const comments = commentsByPostId[data.postId];
            const comment = comments.find((c) => c.id === data.id);
            comment.status = data.status;
            const event = {
                type: "ConmmentUpdated",
                data: comment,
            };
            console.log("=======> Sent event 🛸 to Event bus ", event);
            axios.post(EVENT_BUS_URL, event);
            break;
        }
    }
    res.send({});
});

app.listen(4001, () => {
    console.log("💬 Service listen at ⛩️  :: 4001");
});
