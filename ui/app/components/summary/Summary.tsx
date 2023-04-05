import { Box, BoxProps, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props extends BoxProps {
  children: React.ReactNode;
}

const Summary: FC<Props> = ({ children, ...boxProps }) => (
  <Box
    position={["static", "static", "static", "sticky"]}
    top={["0", "0", "0", "10"]}
    background="galt"
    padding="3w"
    color="grey.800"
    alignSelf="flex-start"
    fontSize="omega"
    w="40%"
    {...boxProps}
  >
    <Text fontWeight="bold" marginBottom="1w" fontSize="epsilon">
      SOMMAIRE
    </Text>
    {children}
  </Box>
);

export default Summary;
