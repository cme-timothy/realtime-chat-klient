import { useState, useContext, useEffect } from "react";
import SocketContext from "../context/socket";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";
import { user } from "../Recoil/user/atom";
import ChatRoomLink from "../components/chatRoomLink";

function Home() {
  const socket = useContext(SocketContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useRecoilState(user);
  const navigate = useNavigate();

  // get all rooms at start and when page refreshes
  useEffect(() => {
    socket.emit("get_rooms");
    socket.on("all_rooms", (data) => {
      const parsedData = JSON.parse(data);
      setChatRooms(parsedData);
    });

    return () => socket.off();
  }, []);

  // recieve new rooms
  useEffect(() => {
    socket.on("new_room", (data) => {
      setChatRooms((prevItems) => {
        return [
          ...prevItems,
          {
            room: data,
          },
        ];
      });
    });

    return () => socket.off();
  });

  // remove rooms
  useEffect(() => {
    socket.on("room_deleted", (data) => {
      setChatRooms(chatRooms.filter((room) => room.room !== data));
    });

    return () => socket.off();
  });

  function handleRoomChange(event) {
    const value = event.target.value;
    setRoom(value);
  }

  function createRoomOnClick() {
    if (room !== "") {
      const stringifyData = JSON.stringify({
        room: room,
        username: username,
      });
      socket.emit("create_room", stringifyData);
      setChatRooms((prevItems) => {
        return [
          ...prevItems,
          {
            room: room,
          },
        ];
      });
      setRoom("");
      return navigate(`/chatroom/${room}`);
    }
  }

  function createRoomOnEnter(event) {
    if (event.key === "Enter" && room !== "") {
      const stringifyData = JSON.stringify({
        room: room,
        username: username,
      });
      socket.emit("create_room", stringifyData);
      setChatRooms((prevItems) => {
        return [
          ...prevItems,
          {
            room: room,
          },
        ];
      });
      setRoom("");
      return navigate(`/chatroom/${room}`);
    }
  }

  function handleUsernameChange(event) {
    const value = event.target.value;
    setUsername(value);
  }

  function createUsernameOnClick() {
    if (username !== "") {
      socket.emit("create_user", username);
    }
  }

  function createUsernameOnEnter(event) {
    if (event.key === "Enter" && username !== "") {
      socket.emit("create_user", username);
    }
  }

  return (
    <div>
      <Helmet>
        <title>Free and open chat rooms - Chatty Chatty Bang Bang</title>
      </Helmet>
      <h1>Welcome to Chatty Chatty Bang Bang</h1>
      <h2>
        A free and open chat platform. Talk to anyone from anywhere either in
        public rooms or private rooms. Join or create a chat room and be chatty
        &#128540;
      </h2>
      <input
        placeholder="..."
        type="text"
        onChange={handleUsernameChange}
        onKeyDown={createUsernameOnEnter}
        value={username}
      />
      <button onClick={createUsernameOnClick}>Create name</button>
      <input
        placeholder="..."
        type="text"
        onChange={handleRoomChange}
        onKeyDown={createRoomOnEnter}
        value={room}
      />
      <button onClick={createRoomOnClick}>Create room</button>

      <h3>All available rooms:</h3>
      {chatRooms.map((data, index) => {
        return <ChatRoomLink key={index} room={data.room} />;
      })}
    </div>
  );
}

export default Home;
