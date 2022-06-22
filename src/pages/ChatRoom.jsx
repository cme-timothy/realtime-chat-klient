import { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import SocketContext from "../context/socket";

function ChatRoom() {
  const socket = useContext(SocketContext);
  const params = useParams();
  const [message, setMessage] = useState("");

  function leaveRoom(roomName) {
    socket.emit("leave_room", roomName);
  }

  function handleMessageChange(event) {
    const value = event.target.value;
    setMessage(value);
  }

  function createMessageOnClick() {
    if (message !== "") {
      socket.emit("message", message);
      setMessage("");
    }
  }

  function createMessageOnEnter(event) {
    if (event.key === "Enter" && message !== "") {
      socket.emit("message", message);
      setMessage("");
    }
  }

  return (
    <div>
      <Link key={params.roomId} to={"/"}>
        <button onClick={() => leaveRoom(params.roomId)}>Leave room</button>
      </Link>
      <input
        className="inputBox"
        placeholder="..."
        type="text"
        onChange={handleMessageChange}
        onKeyDown={createMessageOnEnter}
        value={message}
      />
      <button onClick={createMessageOnClick}>Send message</button>
    </div>
  );
}

export default ChatRoom;
