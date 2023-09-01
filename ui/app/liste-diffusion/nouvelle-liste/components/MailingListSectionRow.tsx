import { Grid } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

interface Props {
  nbColumns?: number;
}

const MailingListSectionRow: FC<PropsWithChildren<Props>> = ({
  children,
  nbColumns = 3,
}) => {
  return (
    <Grid
      templateColumns={`repeat(${nbColumns}, 1fr)`}
      gap={6}
      mb={4}
      bg="white"
      p={4}
    >
      {children}
    </Grid>
  );
};

export default MailingListSectionRow;
