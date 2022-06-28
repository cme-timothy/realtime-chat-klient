import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";

function Profile() {
  const username = useRecoilValue(user);

  return (
    <Flex w="100%" h="80px" align="center" borderBottom="1px solid" borderColor="blue.100">
      <Avatar src="" mr="15px" ml="10px" />
      <Text>{username}</Text>
    </Flex>
  );
}

export default Profile;
