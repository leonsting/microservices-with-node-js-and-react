const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const SERVER = "http://localhost";
const events = [];

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
    const event = req.body;
    events.push(event);
    console.log("<======= Recieve event 🛸 :: ", event);
    console.log("=======> Sent event 🛸 to 4000 ", event);
    axios.post(`${SERVER}:4000/events`, event);
    console.log("=======> Sent event 🛸 to 4001 ", event);
    axios.post(`${SERVER}:4001/events`, event);
    console.log("=======> Sent event 🛸 to 4002 ", event);
    axios.post(`${SERVER}:4002/events`, event);
    console.log("=======> Sent event 🛸 to 4003 ", event);
    axios.post(`${SERVER}:4003/events`, event);

    res.send({ status: "OK" });
});

app.get("/events", (_, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log("Events 🚌 listen at ⛩️  :: 4005");
});
