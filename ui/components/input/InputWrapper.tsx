import { CheckIcon } from "@chakra-ui/icons";
import {
  Center,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

import { LockFill } from "../../theme/icons/LockFill";

interface RightIconsProps {
  success?: boolean;
  loading?: boolean;
  locked?: boolean;
}

interface Props extends PropsWithChildren, RightIconsProps {
  name?: string;
}

export const RightIcon: FC<RightIconsProps> = ({
  loading,
  locked,
  success,
}) => {
  if (loading) return <Spinner boxSize="4" />;
  if (success) return <CheckIcon color={"green.500"} boxSize="4" />;
  if (locked) return <LockFill color={"grey.625"} boxSize="4" />;
  return null;
};

export const InputWrapper: FC<Props> = ({
  name,
  success,
  loading = false,
  locked,
  children,
}) => {
  const hasRightIcon = success || loading || locked;

  return (
    <InputGroup id={`${name}_group_input`} isolation="auto">
      {children}
      {hasRightIcon && (
        <InputRightElement>
          <Center w="40px" h="40px" ml={"0 !important"}>
            <RightIcon loading={loading} locked={locked} success={success} />
          </Center>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
