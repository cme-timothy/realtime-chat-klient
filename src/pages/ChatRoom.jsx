import { useState, useContext, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import SocketContext from "../context/socket";
import Message from "../components/Message";
import Online from "../components/Online";
import { useRecoilState } from "recoil";
import { user } from "../Recoil/user/atom";
import Emoji from "react-emoji-render";
import { Flex, Button, Input, Heading } from "@chakra-ui/react";
import Profile from "../components/Profile";

function ChatRoom() {
  const socket = useContext(SocketContext);
  const params = useParams();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [username, setUsername] = useRecoilState(user);
  const [allUsersOnline, setAllUsersOnline] = useState([]);
  const messagesEndRef = useRef();
  const [privateMessage, setPrivateMessage] = useState("");

  // get all users who are online in the room and all room messages at start
  useEffect(() => {
    socket.emit("get_room_data", params.roomId);
    socket.on("all_room_data", (onlineData, messagesData, userData) => {
      const parsedOnlineData = JSON.parse(onlineData);
      setAllUsersOnline(parsedOnlineData);
      const parsedMessagesData = JSON.parse(messagesData);
      setAllMessages(parsedMessagesData);
      const parsedUserData = JSON.parse(userData);
      setUsername(parsedUserData.username);
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

  // scroll to bottom of chat room for new messages and when joining room
  useEffect(scrollToBottom, [allMessages]);

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  // recieve direct messages from other users
  useEffect(() => {
    socket.on("direct_message", (data) => {
      const parsedData = JSON.parse(data);
      setAllMessages((prevItems) => {
        return [
          ...prevItems,
          {
            message: `Private message: ${parsedData.message}`,
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
            typing: "Now typing...",
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

  function privateMessageUsername(directMessage) {
    const name = typeof directMessage;
    if (name === "string") {
      setPrivateMessage(directMessage);
    } else if (name === "boolean") {
      setPrivateMessage("");
    }
  }

  function createMessageOnClick() {
    if (message !== "") {
      const timestamp = new Date().toLocaleString();
      if (privateMessage !== "") {
        setAllMessages((prevItems) => {
          return [
            ...prevItems,
            {
              directMessage: `Private message to: ${privateMessage}`,
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
        socket.emit("add_message", data, privateMessage);
        setMessage("");
      } else {
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
  }

  function createMessageOnEnter(event) {
    if (event.key === "Enter" && message !== "") {
      const timestamp = new Date().toLocaleString();
      if (privateMessage !== "") {
        setAllMessages((prevItems) => {
          return [
            ...prevItems,
            {
              directMessage: `Private message to: ${privateMessage}`,
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
        socket.emit("add_message", data, privateMessage);
        setMessage("");
      } else {
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
    <Flex bg="yellow.50" borderBottom="1px solid" borderColor="blue.100">
      <Flex direction="column" w="400px" align="center">
        <Profile />
        <Heading borderBottom="1px solid" size="md" m={7} mb={0} as="h3">
          Online
        </Heading>
        <Flex
          direction="column"
          alignItems="center"
          h="60vh"
          w="100%"
          overflowY="auto"
          overflow="overlay"
          sx={{
            "&::-webkit-scrollbar": {
              width: "16px",
              borderRadius: "5px",
              backgroundColor: "gray.100",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "5px",
              backgroundColor: "blue.200",
            },
          }}
        >
          {allUsersOnline.map((data, index) => {
            return (
              <Online
                key={index}
                username={data.username}
                typing={data.typing}
                privateMessageUsername={privateMessageUsername}
              />
            );
          })}
        </Flex>
        <Link key={params.roomId} to={"/"}>
          <Button w="80%" m={3} onClick={() => leaveRoom(params.roomId)}>
            Leave room
          </Button>
        </Link>
      </Flex>
      <Flex
        w="80%"
        direction="column"
        borderLeft="1px solid"
        borderColor="blue.100"
      >
        <Flex
          id="newMessage"
          direction="column"
          h="70vh"
          mt={8}
          overflowY="auto"
          sx={{
            "&::-webkit-scrollbar": {
              width: "16px",
              borderRadius: "5px",
              backgroundColor: "gray.100",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "5px",
              backgroundColor: "blue.200",
            },
          }}
        >
          {allMessages.map((data, index) => {
            return (
              <Message
                key={index}
                private={data.directMessage}
                message={data.message}
                username={data.username}
                timestamp={data.timestamp}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </Flex>
        <Flex>
          <Button bg={0} ml={5} pl={1} pr={1} size="sm">
            <Emoji text=":thumbs_up:" onClick={() => addEmoji(":thumbs_up:")} />
          </Button>
          <Button bg={0} pl={1} pr={1} size="sm">
            <Emoji
              text=":thumbs_down:"
              onClick={() => addEmoji(":thumbs_down:")}
            />
          </Button>
          <Button bg={0} pl={1} pr={1} size="sm">
            <Emoji text=":wave:" onClick={() => addEmoji(":wave:")} />
          </Button>
          <Button bg={0} pl={1} pr={1} size="sm">
            <Emoji
              text=":slight_smile:"
              onClick={() => addEmoji(":slight_smile:")}
            />
          </Button>
          <Button bg={0} pl={1} pr={1} size="sm">
            <Emoji
              text=":grinning_face:"
              onClick={() => addEmoji(":grinning_face:")}
            />
          </Button>
          <Button bg={0} pl={1} pr={1} size="sm">
            <Emoji
              text=":slightly_frowning_face:"
              onClick={() => addEmoji(":slightly_frowning_face:")}
            />
          </Button>
          <Button bg={0} pl={1} pr={1} size="sm">
            <Emoji
              text=":crying_face:"
              onClick={() => addEmoji(":crying_face:")}
            />
          </Button>
          <Button bg={0} mr={5} pl={1} pr={1} size="sm">
            <Emoji text=":heart:" onClick={() => addEmoji(":heart:")} />
          </Button>
        </Flex>
        <Flex ml={3} mr={3} mb={3}>
          <Input
            _hover={{ borderColor: "blue.300" }}
            mr={3}
            borderColor="blue.100"
            placeholder="..."
            type="text"
            onChange={handleMessageChange}
            onKeyDown={createMessageOnEnter}
            value={message}
          />
          <Button pl={9} pr={9} onClick={createMessageOnClick}>
            Send message
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ChatRoom;
