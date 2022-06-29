import { useState, useContext, useEffect } from "react";
import SocketContext from "../context/socket";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";
import { user } from "../Recoil/user/atom";
import ChatRoomLink from "../components/chatRoomLink";
import { Flex, Input, Button, Heading, Text } from "@chakra-ui/react";

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
      socket.emit("create_room", stringifyData, (response) => {
        if (response.status === "ok") {
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
        } else {
          console.log(response.status);
          setRoom("");
        }
      });
    }
  }

  function createRoomOnEnter(event) {
    if (event.key === "Enter" && room !== "") {
      const stringifyData = JSON.stringify({
        room: room,
        username: username,
      });
      socket.emit("create_room", stringifyData, (response) => {
        if (response.status === "ok") {
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
        } else {
          console.log(response.status);
          setRoom("");
        }
      });
    }
  }

  function handleUsernameChange(event) {
    const value = event.target.value;
    setUsername(value);
  }

  function createUsernameOnClick() {
    socket.emit("create_user", username, (response) => {
      if (response.status !== "ok") {
        console.log(response.status);
        setUsername("");
      }
    });
  }

  function createUsernameOnEnter(event) {
    if (event.key === "Enter") {
      socket.emit("create_user", username, (response) => {
        if (response.status !== "ok") {
          console.log(response.status);
          setUsername("");
        }
      });
    }
  }

  return (
    <Flex direction="column" align="center" bg="yellow.50">
      <Helmet>
        <title>Free and open chat rooms - Chatty Chatty Bang Bang</title>
      </Helmet>
      <Text>
        A free and open chat platform. Talk to anyone from anywhere either in
        public rooms or private rooms. Join or create a chat room and be chatty
        &#128540;
      </Text>
      <Input
        placeholder="..."
        type="text"
        onChange={handleUsernameChange}
        onKeyDown={createUsernameOnEnter}
        value={username}
      />
      <Button onClick={createUsernameOnClick}>Create name</Button>
      <Input
        placeholder="..."
        type="text"
        onChange={handleRoomChange}
        onKeyDown={createRoomOnEnter}
        value={room}
      />
      <Button onClick={createRoomOnClick}>Create room</Button>

      <Heading as="h2" size="md">
        All available rooms:
      </Heading>
      {chatRooms.map((data, index) => {
        return <ChatRoomLink key={index} room={data.room} />;
      })}
    </Flex>
  );
}

export default Home;
