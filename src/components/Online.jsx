import { useState } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";

function Online(props) {
  const [privateToggle, setPrivateToggle] = useState(true);
  const [message, setMessage] = useState("");

  function nowTypingAvatar() {
    if (props.typing === "Now typing...") {
      return "green.400";
    } else {
      return "gray.400";
    }
  }

  function privateMessage() {
    if (privateToggle === true) {
      setMessage("Type private message...");
    } else if (privateToggle === false) {
      setMessage("");
      props.privateMessageUsername(false);
    }
    setPrivateToggle(!privateToggle);
  }

  return (
    <Flex
      minHeight="80px"
      align="center"
      w="300px"
      onClick={() => {
        props.privateMessageUsername(props.username);
        privateMessage();
      }}
    >
      <Avatar bg={nowTypingAvatar} src="" mr="15px" ml="10px" />
      <Flex direction="column">
        <Text>{props.username}</Text>
        <Text>{props.typing}</Text>
        <Text>{message}</Text>
      </Flex>
    </Flex>
  );
}

export default Online;
