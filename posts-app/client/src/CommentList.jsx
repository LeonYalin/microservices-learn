export function CommentList({ comments }) {
  return (
    <ul>
      {comments.map((comment) => {
        let content;
        switch (comment.status) {
          case "pending":
            content = "This comment is awainting moderation";
            break;
          case "rejected":
            content = "This comment has been rejected";
            break;
          default:
            content = comment.content;
            break;
        }

        return <li key={comment.id}>{content}</li>;
      })}
    </ul>
  );
}
