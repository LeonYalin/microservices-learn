const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { randomUUID } = require("crypto");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const id = req.params["id"];
  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const id = req.params["id"];
    const comments = commentsByPostId[id] || [];
    const comment = {
      id: randomUUID(),
      content: req.body.content,
      status: "pending",
    };
    comments.push(comment);
    commentsByPostId[id] = comments;

    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: {
          ...comment,
          postId: id,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
    res.status(201).send(comments);
  } catch (e) {
    throw new Error(e);
  }
});

app.post("/events", async (req, res) => {
  console.log("Event received", req.body.type);
  const { type, data } = req.body;

  switch (type) {
    case "CommentModerated":
      const { postId, id, status, content } = data;
      const comments = commentsByPostId[postId];
      const comment = comments.find((c) => c.id === id);
      comment.status = status;

      await axios
        .post("http://event-bus-srv:4005/events", {
          type: "CommentUpdated",
          data: { id, postId, status, content },
        })
        .catch((err) => {
          console.log(err);
        });
      break;
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("server is running on port 4001");
});
