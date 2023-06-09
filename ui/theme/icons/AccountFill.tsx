import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const AccountFill: FC<IconProps> = (props) => {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 2.5C18.02 2.5 22.5 6.98 22.5 12.5C22.5 18.02 18.02 22.5 12.5 22.5C6.98 22.5 2.5 18.02 2.5 12.5C2.5 6.98 6.98 2.5 12.5 2.5ZM6.523 15.916C7.991 18.106 10.195 19.5 12.66 19.5C15.124 19.5 17.329 18.107 18.796 15.916C17.1317 14.3606 14.9379 13.4968 12.66 13.5C10.3817 13.4966 8.18751 14.3604 6.523 15.916ZM12.5 11.5C14.1569 11.5 15.5 10.1569 15.5 8.5C15.5 6.84315 14.1569 5.5 12.5 5.5C10.8431 5.5 9.5 6.84315 9.5 8.5C9.5 10.1569 10.8431 11.5 12.5 11.5Z"
        fill="currentColor"
      />
    </Icon>
  );
};
