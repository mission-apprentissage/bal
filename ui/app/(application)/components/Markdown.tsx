import { getLink } from "@codegouvfr/react-dsfr/link";
import { FC } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  children: string | null | undefined;
}

const { Link } = getLink();

const Markdown: FC<Props> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
        a({ children, ...rest }) {
          return (
            <Link {...rest} style={{ wordBreak: "break-word" }}>
              {children}
            </Link>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
