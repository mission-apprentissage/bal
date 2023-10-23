import { fr } from "@codegouvfr/react-dsfr";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { FC, PropsWithChildren } from "react";

interface Props extends Pick<InputProps, "hideLabel" | "classes"> {
  inputId: string;
}

const InputLabel: FC<PropsWithChildren<Props>> = ({ hideLabel, classes, inputId, children }) => {
  return (
    <label className={cx(fr.cx("fr-label", hideLabel && "fr-sr-only"), classes?.label)} htmlFor={inputId}>
      {children}
    </label>
  );
};

export default InputLabel;
