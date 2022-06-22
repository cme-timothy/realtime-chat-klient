import { useEffect } from "react";
import { io } from "socket.io-client";
import { Helmet } from "react-helmet-async";
import ChatRoom from "./ChatRoom";

let socket;

function Main() {
  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("message", (data) => {
      console.log(data);
    });

    socket.on("new_client", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => socket.off();
  }, []);

  function joinRoom(roomName) {
    socket.emit("join_room", roomName);
  }

  function leaveRoom(roomName) {
    socket.emit("leave_room", roomName);
  }

  function handleMessage() {
    socket.emit("message", "Hello Server");
  }

  return (
    <div>
      <Helmet>
        <title>Free and open chat rooms - Chatty Chatty Bang Bang</title>
      </Helmet>
      <h1>Welcome to Chatty Chatty Bang Bang</h1>
      <h2>
        A free and open chat platform. Talk to anyone from anywhere in either
        public rooms or private rooms. Join a chat room and get chatty &#128540;
      </h2>
      <h3>All available rooms:</h3>
      <ChatRoom />
      <button onClick={() => joinRoom("Test room")}>Join room</button>
      <button onClick={() => leaveRoom("Test room")}>Leave room</button>
      <button onClick={handleMessage}>Send message</button>
    </div>
  );
}

export default Main;
