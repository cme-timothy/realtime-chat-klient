import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SocketContext from "../context/socket";
import Message from "../components/Message";
import Online from "../components/Online";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";

function ChatRoom() {
  const socket = useContext(SocketContext);
  const params = useParams();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const username = useRecoilValue(user);
  const [allUsersOnline, setAllUsersOnline] = useState([]);

  // get all users online and room messages at start
  useEffect(() => {
    socket.emit("get_room_data", params.roomId);
    socket.on("all_room_data", (onlineData, messagesData) => {
      const parsedOnlineData = JSON.parse(onlineData);
      setAllUsersOnline(parsedOnlineData);
      const parsedMessagesData = JSON.parse(messagesData);
      setAllMessages(parsedMessagesData);
    });

    return () => socket.off();
  }, []);

  // recieve new online users from other users
  useEffect(() => {
    socket.on("new_user_online", (data) => {
      setAllUsersOnline((prevItems) => {
        return [
          ...prevItems,
          {
            room: params.roomId,
            username: data,
          },
        ];
      });
    });

    return () => socket.off();
  });

  // recieve users offline from other users
  useEffect(() => {
    socket.on("user_offline", (data) => {
      setAllUsersOnline(
        allUsersOnline.filter((user) => user.username !== data)
      );
    });

    return () => socket.off();
  });

  // recieve new messages from other users
  useEffect(() => {
    socket.on("new_message", (data) => {
      const parsedData = JSON.parse(data);
      setAllMessages((prevItems) => {
        return [
          ...prevItems,
          {
            message: parsedData.message,
            room: parsedData.room,
            username: parsedData.username,
            timestamp: parsedData.timestamp,
          },
        ];
      });
    });

    return () => socket.off();
  });

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

  function leaveRoom(room) {
    const data = JSON.stringify({
      room: room,
      username: username,
    });
    socket.emit("leave_room", data);
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
      {allUsersOnline.map((data, index) => {
        return <Online key={index} username={data.username} />;
      })}
    </div>
  );
}

export default ChatRoom;
