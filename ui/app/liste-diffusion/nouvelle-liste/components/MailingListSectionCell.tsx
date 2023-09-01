import { GridItem, GridItemProps } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

const MailingListSectionCell: FC<PropsWithChildren<GridItemProps>> = ({
  children,
  ...props
}) => {
  return (
    <GridItem w="100%" display="flex" alignItems="center" {...props}>
      {children}
    </GridItem>
  );
};

export default MailingListSectionCell;
