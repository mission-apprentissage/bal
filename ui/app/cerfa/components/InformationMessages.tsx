import { Box } from "@mui/material";
import { FC } from "react";
import { useRecoilState } from "recoil";

import InformationMessage from "../../components/InformationMessage";
import Markdown from "../../components/Markdown";
import { activeFieldState, fieldsState } from "../atoms/fields.atom";
import { informationMessagesState } from "../atoms/informationMessages.atom";

const InformationMessages: FC = () => {
  const [messages = []] = useRecoilState(informationMessagesState);
  const [activeField] = useRecoilState(activeFieldState);
  const [fields] = useRecoilState(fieldsState);

  const activeFieldMessages = fields[activeField]?.informationMessages ?? [];

  return (
    <Box p={2} pt={0} position="sticky" top={24}>
      {[...activeFieldMessages, ...messages]?.map((message) => {
        const { type, content } = message;

        return (
          <InformationMessage
            key={`${type}-${content?.slice(0, 10)}`}
            type={type}
            collapse={
              message.collapse
                ? {
                    label: message.collapse.label,
                    content: <Markdown>{message.collapse.content}</Markdown>,
                  }
                : undefined
            }
          >
            <Markdown>{content}</Markdown>
          </InformationMessage>
        );
      })}
    </Box>
  );
};

export default InformationMessages;
