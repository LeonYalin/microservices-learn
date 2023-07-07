import { useState } from "react";
import axios from "axios";

export function CommentCreate({ postId }) {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://posts.com/posts/${postId}/comments`, {
        content,
      })
      .catch((err) => {
        console.log(err.message);
      });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}