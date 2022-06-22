import { useContext } from "react";
import { Link } from "react-router-dom";
import SocketContext from "../context/socket";

function ChatRoomLink(props) {
  const socket = useContext(SocketContext);

  function joinRoomOnClick() {
    socket.emit("join_room", props.roomName);
  }

  return (
    <div>
      <h3>{props.roomName}</h3>
      <Link key={props.keyId} to={`/chatroom/${props.roomName}`}>
        <button onClick={joinRoomOnClick}>Join room</button>
      </Link>
    </div>
  );
}

export default ChatRoomLink;
