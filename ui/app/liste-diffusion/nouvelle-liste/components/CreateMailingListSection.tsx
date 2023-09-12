import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

interface Props {
  title: string;
}

const CreateMailingListSection: FC<PropsWithChildren<Props>> = ({ title, children }) => {
  return (
    <AccordionItem bg="blue_france.extra_light">
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left">
          <Heading as="h4" fontSize="ml">
            {title}
          </Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>{children}</AccordionPanel>
    </AccordionItem>
  );
};

export default CreateMailingListSection;
