import {
  Button,
  ButtonProps,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

import { ArrowRightLine } from "../../theme/icons/ArrowRightLine";

interface Props {
  title: string;
  modalProps: Omit<ModalProps, "children">;
  proceedButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

export const Dialog: FC<PropsWithChildren<Props>> = ({
  title,
  children,
  modalProps,
  proceedButtonProps,
  cancelButtonProps,
}) => {
  return (
    <Modal closeOnOverlayClick={false} size="4xl" {...modalProps}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.48)" />
      <ModalContent bg="white" color="primaryText" borderRadius="none">
        <ModalHeader>
          <ArrowRightLine mt="-0.5rem" />
          <Text as="span" ml="1rem" textStyle={"h4"}>
            {title}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            {cancelButtonProps && (
              <Button variant="secondary" {...cancelButtonProps}>
                {cancelButtonProps.children ?? "Annuler"}
              </Button>
            )}
            {proceedButtonProps && (
              <Button variant="primary" {...proceedButtonProps}>
                {proceedButtonProps.children ?? "Continuer"}
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
