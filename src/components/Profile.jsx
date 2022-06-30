import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";

function Profile() {
  const username = useRecoilValue(user);

  return (
    <Flex
      bg="white"
      w="100%"
      h="80px"
      borderBottom="1px solid"
      borderColor="blue.100"
      justifyContent="center"
    >
      <Flex align="center" w="300px">
        <Avatar src="" mr="15px" ml="10px" />
        <Text>{username}</Text>
      </Flex>
    </Flex>
  );
}

export default Profile;
