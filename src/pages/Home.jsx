import { useState, useContext } from "react";
import SocketContext from "../context/socket";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";
import { rooms } from "../Recoil/rooms/atom";
import ChatRoomLink from "../components/chatRoomLink";

function Home() {
  const socket = useContext(SocketContext);
  const [chatRooms, setChatRooms] = useRecoilState(rooms);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  function handleRoomChange(event) {
    const value = event.target.value;
    setRoomName(value);
  }

  function createRoomOnClick() {
    if (roomName !== "") {
      socket.emit("join_room", roomName);
      setChatRooms((prevItems) => {
        return [
          ...prevItems,
          {
            roomName: roomName,
          },
        ];
      });
      setRoomName("");
      return navigate (`/chatroom/${roomName}`);
    }
  }

  function createRoomOnEnter(event) {
    if (event.key === "Enter" && roomName !== "") {
      socket.emit("join_room", roomName);
      setChatRooms((prevItems) => {
        return [
          ...prevItems,
          {
            roomName: roomName,
          },
        ];
      });
      setRoomName("");
      return navigate (`/chatroom/${roomName}`);
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
        className="inputBox"
        placeholder="..."
        type="text"
        onChange={handleRoomChange}
        onKeyDown={createRoomOnEnter}
        value={roomName}
      />
      <button onClick={createRoomOnClick}>Create room</button>

      <h3>All available rooms:</h3>
      {chatRooms.map((data, index) => {
        return (
          <ChatRoomLink
            key={index}
            roomName={data.roomName}
            socket={socket}
            keyId={index}
          />
        );
      })}
    </div>
  );
}

export default Home;
