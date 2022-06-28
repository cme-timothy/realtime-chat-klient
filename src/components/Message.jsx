import Emoji from "react-emoji-render";

function Message(props) {
  return (
    <div>
      <h4>{props.username}</h4>
      <h4>{props.private}</h4>
      <Emoji text={props.message} />
      <h4>{props.timestamp}</h4>
    </div>
  );
}

export default Message;
