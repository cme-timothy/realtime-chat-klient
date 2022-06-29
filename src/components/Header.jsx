import { Flex, Heading } from "@chakra-ui/react";

function Header() {
  return (
    <Flex
      align="center"
      bg="yellow.50"
      justifyContent="center"
      borderBottom="1px solid"
      borderColor="blue.100"
    >
      <Heading p={5} as="h1">
        All onboard: Chatty Chatty Bang Bang
      </Heading>
    </Flex>
  );
}

export default Header;
