const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const EVENT_BUS_URL = "http://localhost:4005/events";

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {};

app.get("/posts", (_, res) => {
    res.send(posts);
});

app.post("/posts", async (req, res) => {
    const { title } = req.body;
    const id = randomBytes(4).toString("hex");
    posts[id] = { id, title };
    const event = {
        type: "PostCreated",
        data: { id, title },
    };
    console.log("=======> Sent event 🛸 to Event bus ", event);
    await axios.post(EVENT_BUS_URL, event);
    res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    // console.log("Recieve event 🛸 :: ", req.body);
    res.send({});
});

app.listen(4000, () => {
    console.log("🏤 Service listen at ⛩️  :: 4000 ");
});
