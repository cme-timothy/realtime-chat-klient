import { Avatar, Flex, Text } from "@chakra-ui/react";

function Online(props) {
  return (
    <Flex w="100%" h="80px" align="center">
      <Avatar src="" mr="15px" ml="10px" />
      <Text
        onClick={() => {
          props.privateMessage(props.username);
        }}
      >
        {props.username}
      </Text>
      <Text>{props.typing}</Text>
    </Flex>
  );
}

export default Online;
