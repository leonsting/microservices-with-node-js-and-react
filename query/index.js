const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const EVENTS = {
    POST_CREATED: "PostCreated",
    COMMENT_CREATED: "CommentCreated",
    COMMENT_UPDATED: "ConmmentUpdated",
};
const EVENT_BUS_URL = "http://localhost:4005/events";

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {};

app.get("/posts", (_, res) => {
    res.send(posts);
});

const handleEvent = (type, data) => {
    const event = { type, data };
    switch (type) {
        case EVENTS.POST_CREATED: {
            console.log("<======= Recieve event 🛸 :: ", event);
            posts[data.id] = { ...data, comments: [] };
            break;
        }
        case EVENTS.COMMENT_CREATED: {
            console.log("<======= Recieve event 🛸 :: ", event);
            posts[data.postId].comments.push(data);
            break;
        }
        case EVENTS.COMMENT_UPDATED: {
            console.log("<======= Recieve event 🛸 :: ", event);
            const post = posts[data.postId];
            const comment = post.comments.find((c) => c.id === data.id);
            comment.status = data.status;
            break;
        }
    }
};

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({ status: "OK" });
});

app.listen(4002, async () => {
    console.log("📡 Service listen at ⛩️  :: 4002 ");
    try {
        const res = await axios.get(EVENT_BUS_URL);
        console.log(res.data);
        for (let event of res.data) {
            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log(error);
    }
});
