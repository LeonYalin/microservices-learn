import logo from "./logo.svg";
import "./App.css";
import { PostCreate } from "./PostCreate";
import { PostList } from "./PostList";

export default function App() {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate></PostCreate>
      <hr />
      <h1>Posts</h1>
      <PostList></PostList>
    </div>
  );
}
