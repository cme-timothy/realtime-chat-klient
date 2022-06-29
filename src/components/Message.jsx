import { Flex, Text } from "@chakra-ui/react";
import Emoji from "react-emoji-render";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";

function Message(props) {
  const username = useRecoilValue(user);

  function messageTogglePosition() {
    if (props.username === username) {
      return "flex-end";
    } else {
      return "flex-start";
    }
  }

  function messageToggleColor() {
    if (props.username === username) {
      return "green.100";
    } else {
      return "blue.100";
    }
  }

  return (
    <Flex
      bg={messageToggleColor}
      w="fit-content"
      minWidth="100px"
      p={3}
      m={2}
      ml={7}
      mr={7}
      borderRadius="10px"
      direction="column"
      alignSelf={messageTogglePosition}
    >
      <Text>{props.username}</Text>
      <Text>{props.private}</Text>
      <Emoji text={props.message} />
      <Text>{props.timestamp}</Text>
    </Flex>
  );
}

export default Message;
