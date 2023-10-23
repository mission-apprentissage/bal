import { fr } from "@codegouvfr/react-dsfr";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { FC, PropsWithChildren } from "react";

interface Props extends Pick<InputProps, "state" | "classes"> {
  messageId: string;
}

const InputState: FC<PropsWithChildren<Props>> = ({ messageId, state, classes, children }) => {
  return (
    <p
      id={messageId}
      className={cx(
        fr.cx(
          (() => {
            switch (state) {
              case "error":
                return "fr-error-text";
              case "success":
                return "fr-valid-text";
            }
          })()
        ),
        classes?.message
      )}
    >
      {children}
    </p>
  );
};

export default InputState;
