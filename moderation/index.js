const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const EVENT_BUS_URL = "http://localhost:4005/events";

const app = express();

app.use(bodyParser.json());

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    switch (type) {
        case "CommentCreated": {
            console.log("<======= Recieve event 🛸 :: ", req.body);
            data.status = data.content.includes("orange")
                ? "rejected"
                : "approved";
            const event = { type: "ConmmentModerated", data };
            console.log("=======> Sent event 🛸 to Event bus ", event);
            axios.post(EVENT_BUS_URL, event);
            break;
        }
    }
    res.send({});
});

app.listen(4003, () => {
    console.log("👮 Service listen at ⛩️  :: 4003");
});
