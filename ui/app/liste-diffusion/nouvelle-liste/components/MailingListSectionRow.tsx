import { Grid } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

const MailingListSectionRow: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={4} bg="white" p={4}>
      {children}
    </Grid>
  );
};

export default MailingListSectionRow;
