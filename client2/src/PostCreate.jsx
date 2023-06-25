import { useState } from "react";
import axios from "axios";

export function PostCreate() {
  const [title, setTitle] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("http://posts.com/posts/create", {
        title,
      })
      .catch((err) => {
        console.log(err.message);
      });
    setTitle("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="formGroup">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
