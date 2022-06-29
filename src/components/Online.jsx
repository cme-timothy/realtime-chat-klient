import { Avatar, Flex, Text } from "@chakra-ui/react";

function Online(props) {
  function nowTypingAvatar() {
    if (props.typing === "Now typing...") {
      return "green.400";
    } else {
      return "gray.400";
    }
  }

  return (
    <Flex minHeight="80px" align="center" w="300px">
      <Avatar bg={nowTypingAvatar} src="" mr="15px" ml="10px" />
      <Flex direction="column">
        <Text
          onClick={() => {
            props.privateMessage(props.username);
          }}
        >
          {props.username}
        </Text>
        <Text>{props.typing}</Text>
      </Flex>
    </Flex>
  );
}

export default Online;
