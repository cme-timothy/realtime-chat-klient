import { useContext } from "react";
import { Link } from "react-router-dom";
import SocketContext from "../context/socket";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";
import { Flex, Heading, Button } from "@chakra-ui/react";

function ChatRoomLink(props) {
  const socket = useContext(SocketContext);
  const username = useRecoilValue(user);

  function joinRoomOnClick() {
    const stringifyData = JSON.stringify({
      room: props.room,
      username: username,
    });
    socket.emit("join_room", stringifyData);
  }

  return (
    <Flex
      bg="white"
      borderRadius="5px"
      border="solid 1px"
      borderColor="blue.100"
      direction="column"
      justifyContent="space-around"
      align="center"
      w="190px"
      h="180px"
      mt={5}
    >
      <Heading as="h4" size="md">
        {props.room}
      </Heading>
      <Link key={props.room} to={`/chatroom/${props.room}`}>
        <Button onClick={joinRoomOnClick}>Join room</Button>
      </Link>
    </Flex>
  );
}

export default ChatRoomLink;
