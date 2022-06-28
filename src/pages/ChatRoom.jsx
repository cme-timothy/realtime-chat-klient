import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SocketContext from "../context/socket";
import Message from "../components/Message";
import Online from "../components/Online";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";
import Emoji from "react-emoji-render";

function ChatRoom() {
  const socket = useContext(SocketContext);
  const params = useParams();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const username = useRecoilValue(user);
  const [allUsersOnline, setAllUsersOnline] = useState([]);

  // get all users who are online in the room and all room messages at start
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

  // recieve new users who join the room
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

  // delete users from the room who have left the room
  useEffect(() => {
    socket.on("user_offline", (data) => {
      setAllUsersOnline(
        allUsersOnline.filter((user) => user.username !== data)
      );
    });

    return () => socket.off();
  });

  // recieve new messages from other users in the room
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

  // indikator for users who are typing in the room
  useEffect(() => {
    socket.on("user_typing", (data) => {
      const parsedData = JSON.parse(data);
      setAllUsersOnline(
        allUsersOnline.filter((users) => users.username !== parsedData.username)
      );
      setAllUsersOnline((prevItems) => {
        return [
          {
            room: params.roomId,
            username: parsedData.username,
            typing: "typing",
          },
          ...prevItems,
        ];
      });
    });

    return () => socket.off();
  });

  // indikator for users who delete their message before sending in the room
  useEffect(() => {
    socket.on("user_regret", (data) => {
      const parsedData = JSON.parse(data);
      setAllUsersOnline(
        allUsersOnline.map((users) =>
          users.username === parsedData.username
            ? { ...users, typing: "" }
            : users
        )
      );
    });

    return () => socket.off();
  });

  function handleMessageChange(event) {
    const value = event.target.value;
    setMessage(value);
    const data = JSON.stringify({
      room: params.roomId,
      username: username,
    });
    if (value === "") {
      socket.emit("no_message", data);
    } else {
      socket.emit("typing_message", data);
    }
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

  function addEmoji(emoji) {
    setMessage(`${message}${emoji}`);
    const data = JSON.stringify({
      room: params.roomId,
      username: username,
    });
    socket.emit("typing_message", data);
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
        placeholder="..."
        type="text"
        onChange={handleMessageChange}
        onKeyDown={createMessageOnEnter}
        value={message}
      />
      <button onClick={createMessageOnClick}>Send message</button>
      <Emoji text=":thumbs_up:" onClick={() => addEmoji(":thumbs_up:")} />
      <Emoji text=":thumbs_down:" onClick={() => addEmoji(":thumbs_down:")} />
      <Emoji text=":wave:" onClick={() => addEmoji(":wave:")} />
      <Emoji text=":slight_smile:" onClick={() => addEmoji(":slight_smile:")} />
      <Emoji
        text=":grinning_face:"
        onClick={() => addEmoji(":grinning_face:")}
      />
      <Emoji
        text=":slightly_frowning_face:"
        onClick={() => addEmoji(":slightly_frowning_face:")}
      />
      <Emoji text=":crying_face:" onClick={() => addEmoji(":crying_face:")} />
      <Emoji text=":heart:" onClick={() => addEmoji(":heart:")} />
      {allUsersOnline.map((data, index) => {
        return (
          <Online key={index} username={data.username} typing={data.typing} />
        );
      })}
    </div>
  );
}

export default ChatRoom;
