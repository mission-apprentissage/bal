import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const IoArrowBackward: FC<IconProps> = (props) => (
  <Icon viewBox="0 0 24 24" width="24px" height="24px" {...props}>
    <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" fill="currentColor" />
  </Icon>
);
