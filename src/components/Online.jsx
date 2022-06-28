function Online(props) {
  return (
    <div>
      <h4
        onClick={() => {
          props.privateMessage(props.username);
        }}
      >
        {props.username}
      </h4>
      <h5>{props.typing}</h5>
    </div>
  );
}

export default Online;
