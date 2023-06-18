const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const { randomUUID } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomUUID();
  posts[id] = {
    id,
    title: req.body.title,
  };
  await axios
    .post("http://localhost:4005/events", {
      type: "PostCreated",
      data: posts[id],
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Event received", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
