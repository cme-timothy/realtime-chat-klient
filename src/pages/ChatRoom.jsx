import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SocketContext from "../context/socket";
import Message from "../components/Message";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";

function ChatRoom() {
  const socket = useContext(SocketContext);
  const params = useParams();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const username = useRecoilValue(user);

  // get all messages at start and when page refreshes
  useEffect(() => {
    socket.emit("get_messages", params.roomId);
    socket.on("all_messages", (data) => {
      const parsedData = JSON.parse(data);
      setAllMessages(parsedData);
    });
    return () => socket.off();
  }, []);

  // recieve messages from other users
  useEffect(() => {
    socket.on("new_message", (data) => {
      const parsedData = JSON.parse(data);
      setAllMessages((prevItems) => {
        return [
          ...prevItems,
          {
            message: parsedData.message,
            room: parsedData.message,
            username: parsedData.username,
            timestamp: parsedData.timestamp,
          },
        ];
      });
    });

    return () => socket.off();
  });

  function leaveRoom(roomName) {
    socket.emit("leave_room", roomName);
  }

  function handleMessageChange(event) {
    const value = event.target.value;
    setMessage(value);
  }

  function createMessageOnClick() {
    if (message !== "") {
      const timestamp = new Date().toLocaleString();
      setAllMessages((prevItems) => {
        return [
          ...prevItems,
          {
            message: message,
            room: params.roomId,
            username: username,
            timestamp: timestamp,
          },
        ];
      });
      const data = JSON.stringify({
        message: message,
        room: params.roomId,
        username: username,
        timestamp: timestamp,
      });
      socket.emit("add_message", data);
      setMessage("");
    }
  }

  function createMessageOnEnter(event) {
    if (event.key === "Enter" && message !== "") {
      const timestamp = new Date().toLocaleString();
      setAllMessages((prevItems) => {
        return [
          ...prevItems,
          {
            message: message,
            room: params.roomId,
            username: username,
            timestamp: timestamp,
          },
        ];
      });
      const data = JSON.stringify({
        message: message,
        room: params.roomId,
        username: username,
        timestamp: timestamp,
      });
      socket.emit("add_message", data);
      setMessage("");
    }
  }

  return (
    <div>
      <Link key={params.roomId} to={"/"}>
        <button onClick={() => leaveRoom(params.roomId)}>Leave room</button>
      </Link>
      {allMessages.map((data, index) => {
        return (
          <Message
            key={index}
            message={data.message}
            username={data.username}
            timestamp={data.timestamp}
          />
        );
      })}
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
