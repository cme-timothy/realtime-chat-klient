import { useState, useContext, useEffect } from "react";
import SocketContext from "../context/socket";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";
import { user } from "../Recoil/user/atom";
import ChatRoomLink from "../components/chatRoomLink";
import {
  Flex,
  Input,
  Button,
  Heading,
  Text,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";

function Home() {
  const socket = useContext(SocketContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useRecoilState(user);
  const navigate = useNavigate();
  const [nameError, setNameError] = useState(false);
  const [nameStatus, setNameStatus] = useState("");
  const [valueUsername, setValueUsername] = useState("");
  const [roomError, setRoomError] = useState(false);

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
          setRoomError(false);
          setRoom("");
          return navigate(`/chatroom/${room}`);
        } else {
          setRoomError(true);
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
          setRoomError(false);
          setRoom("");
          return navigate(`/chatroom/${room}`);
        } else {
          setRoomError(true);
          setRoom("");
        }
      });
    }
  }

  function handleUsernameChange(event) {
    const value = event.target.value;
    setValueUsername(value);
  }

  function createUsernameOnClick() {
    socket.emit("create_user", valueUsername, (response) => {
      if (response.status === "Name is taken.") {
        setNameStatus(response.status);
        setNameError(true);
        setValueUsername("");
      } else if (response.status === "Name is empty.") {
        setNameStatus(response.status);
        setNameError(true);
        setValueUsername("");
      } else {
        setNameError(false);
        setUsername(valueUsername);
        setValueUsername("");
      }
    });
  }

  function createUsernameOnEnter(event) {
    if (event.key === "Enter") {
      socket.emit("create_user", valueUsername, (response) => {
        if (response.status === "Name is taken.") {
          setNameStatus(response.status);
          setNameError(true);
          setValueUsername("");
        } else if (response.status === "Name is empty.") {
          setNameStatus(response.status);
          setNameError(true);
          setValueUsername("");
        } else {
          setNameError(false);
          setUsername(valueUsername);
          setValueUsername("");
        }
      });
    }
  }

  return (
    <Flex direction="column" bg="yellow.50" align="center">
      <Helmet>
        <title>Free and open chat rooms - Chatty Chatty Bang Bang</title>
      </Helmet>
      <Heading mt="50px">{`Your name: ${username}`}</Heading>
      <Flex direction="column" w="400px">
        <FormControl isInvalid={nameError}>
          <Flex align="center" mt={12} mb={3}>
            <FormLabel htmlFor="name" fontSize="2xl" mb={0}>
              Create Name
            </FormLabel>
            <Text color="gray.500" fontStyle="italic">
              (optional)
            </Text>
          </Flex>
          <Input
            m="auto"
            id="name"
            placeholder="..."
            type="text"
            onChange={handleUsernameChange}
            onKeyDown={createUsernameOnEnter}
            value={valueUsername}
          />
          {!nameError ? (
            <FormHelperText>
              Enter the name you'd like to use in chatrooms.
            </FormHelperText>
          ) : (
            <FormErrorMessage>{nameStatus}</FormErrorMessage>
          )}
          <Button w="100%" mt={5} mb={5} onClick={createUsernameOnClick}>
            Create name
          </Button>
        </FormControl>

        <FormControl isInvalid={roomError}>
          <Flex align="center" mb={3}>
            <FormLabel htmlFor="roomName" fontSize="2xl" mb={0}>
              Create Room
            </FormLabel>
            <Text color="gray.500" fontStyle="italic">
              (optional)
            </Text>
          </Flex>
          <Input
            m="auto"
            id="roomName"
            placeholder="..."
            type="text"
            onChange={handleRoomChange}
            onKeyDown={createRoomOnEnter}
            value={room}
          />
          {!roomError ? (
            <FormHelperText>
              Enter the name of the room you'd like to create.
            </FormHelperText>
          ) : (
            <FormErrorMessage>Room name is taken.</FormErrorMessage>
          )}
          <Button w="100%" mt={5} mb={5} onClick={createRoomOnClick}>
            Create room
          </Button>
        </FormControl>
      </Flex>

      <Heading mt={5} as="h3" size="md">
        All available rooms:
      </Heading>
      {chatRooms.map((data, index) => {
        return <ChatRoomLink key={index} room={data.room} />;
      })}
    </Flex>
  );
}

export default Home;
