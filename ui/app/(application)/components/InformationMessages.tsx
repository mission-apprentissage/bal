import { FC } from "react";
import { InformationMessage as IInformationMessage } from "shared/helpers/cerfa/types/cerfa.types";

import InformationMessage from "./InformationMessage";
import Markdown from "./Markdown";

interface Props {
  messages: IInformationMessage[];
}

const InformationMessages: FC<Props> = ({ messages }) => {
  return (
    <>
      {messages.map((message) => {
        const { type, content, collapse, ...rest } = message;

        return (
          <InformationMessage
            key={`${type}-${content?.slice(0, 10)}`}
            type={type}
            {...rest}
            collapse={
              collapse
                ? {
                    label: collapse.label,
                    content: <Markdown>{collapse.content}</Markdown>,
                  }
                : undefined
            }
          >
            <Markdown>{content}</Markdown>
          </InformationMessage>
        );
      })}
    </>
  );
};

export default InformationMessages;
