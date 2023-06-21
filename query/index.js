const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

function handleEvent(type, data) {
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case "CommentCreated": {
      const { postId, id, content, status } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status });
      break;
    }
    case "CommentUpdated": {
      const { postId, id, content, status } = data;
      const post = posts[postId];
      const comment = post.comments.find((c) => c.id === id);

      comment.content = content;
      comment.status = status;
      break;
    }
  }
}

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on port 4002");
  const res = await axios.get("http://localhost:4005/events").catch((err) => {
    console.log(err.message);
  });
  const events = res.data;
  events.forEach(({ type, data }) => {
    console.log("Processing event: " + type);
    handleEvent(type, data);
  });
});
