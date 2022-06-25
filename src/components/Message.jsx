function Message(props) {
  return (
    <div>
      <h4>{props.username}</h4>
      <h4>{props.message}</h4>
      <h4>{props.timestamp}</h4>
    </div>
  );
}

export default Message;
