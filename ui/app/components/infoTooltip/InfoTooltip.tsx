import {
  Avatar,
  Badge,
  Box,
  Flex,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverContentProps,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import React, { FC, memo } from "react";
import ReactMarkdown from "react-markdown";

import ExternalLinkLine from "../../../components/link/ExternalLinkLine";
import { TooltipIcon } from "../../../theme/icons/Tooltip";
import { prettyPrintDate } from "../../../utils/date.utils";
import { replaceLinks } from "../../../utils/markdown.utils";

interface History {
  who: string;
  when: string;
  what: string;
  role: string;
  to: string;
}

interface Props extends PopoverContentProps {
  description: string;
  descriptionComponent?: React.ReactNode;
  label: string;
  history?: History[];
  noHistory?: boolean;
}

const InfoTooltip: FC<Props> = memo(
  ({
    description,
    descriptionComponent,
    label,
    history,
    noHistory = true,
    ...rest
  }) => {
    return (
      <Popover placement="bottom">
        <PopoverTrigger>
          <IconButton
            icon={<TooltipIcon color={"grey.700"} w="23px" h="23px" />}
            aria-label={"tooltip"}
          />
        </PopoverTrigger>
        <PopoverContent {...rest}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="bold">{label}</PopoverHeader>
          <PopoverBody>
            <Box>
              {descriptionComponent}
              {!descriptionComponent &&
                replaceLinks(description).map((part, i) => {
                  return typeof part === "string" ? (
                    <Text as="span" key={i}>
                      <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                        {part}
                      </ReactMarkdown>
                    </Text>
                  ) : (
                    <Link
                      href={part.href}
                      fontSize="md"
                      key={i}
                      textDecoration={"underline"}
                      isExternal
                    >
                      {part.linkText}{" "}
                      <ExternalLinkLine
                        w={"0.75rem"}
                        h={"0.75rem"}
                        mb={"0.125rem"}
                        ml={"0.125rem"}
                      />
                    </Link>
                  );
                })}
            </Box>
          </PopoverBody>
          {history && !noHistory && (
            <>
              <PopoverHeader fontWeight="bold">Historique</PopoverHeader>
              <PopoverBody>
                {history?.map((entry, i) => {
                  return (
                    <Wrap key={i} mb={3}>
                      <WrapItem>
                        <Avatar name={entry.who} size="xs" />
                      </WrapItem>
                      <Flex flexDirection="column">
                        <Flex alignItems="center">
                          <Text textStyle="sm" fontWeight="bold">
                            {entry.who}
                          </Text>
                          <Badge
                            variant="solid"
                            bg="greenmedium.300"
                            borderRadius="16px"
                            color="grey.800"
                            textStyle="sm"
                            px="15px"
                            ml="10px"
                          >
                            {entry.role}
                          </Badge>
                        </Flex>
                        <Text textStyle="xs">
                          {prettyPrintDate(entry.when)}
                        </Text>
                      </Flex>
                      <Text textStyle="sm" mt="0">
                        A modifié(e) la valeur du champ par {entry.to}
                      </Text>
                    </Wrap>
                  );
                })}
              </PopoverBody>
            </>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);

export default InfoTooltip;
