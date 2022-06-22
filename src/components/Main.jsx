import { useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import SocketContext from "../context/socket";
import Home from "../pages/Home";
import ChatRoom from "../pages/ChatRoom";

function Main() {
  const socket = useContext(SocketContext);

  useEffect(() => {
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
  },);

  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default Main;
