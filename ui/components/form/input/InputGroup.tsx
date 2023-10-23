import { fr } from "@codegouvfr/react-dsfr";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { FC, ForwardedRef, PropsWithChildren } from "react";

import InputLabel from "./InputLabel";
import InputState from "./InputState";

interface Props extends InputProps.RegularInput {
  ref: ForwardedRef<HTMLDivElement>;
  inputId: string;
  messageId: string;
}

const InputGroup: FC<PropsWithChildren<Props>> = ({
  children,
  nativeInputProps,
  disabled,
  state,
  style,
  classes,
  className,
  ref,
  id,
  inputId,
  label,
  hideLabel,
  hintText,
  messageId,
  stateRelatedMessage,
  ...rest
}) => {
  return (
    <div
      className={cx(
        fr.cx(
          nativeInputProps?.type === "file" ? "fr-upload-group" : "fr-input-group",
          disabled && "fr-input-group--disabled",
          (() => {
            switch (state) {
              case "error":
                return "fr-input-group--error";
              case "success":
                return "fr-input-group--valid";
              case "default":
                return undefined;
            }
          })()
        ),
        classes?.root,
        className
      )}
      style={style}
      ref={ref}
      id={id}
      {...rest}
    >
      <InputLabel inputId={inputId} hideLabel={hideLabel} classes={classes}>
        {label}
        {hintText !== undefined && <span className="fr-hint-text">{hintText}</span>}
      </InputLabel>
      {children}
      {state !== "default" && (
        <InputState state={state} messageId={messageId} classes={classes}>
          {stateRelatedMessage}
        </InputState>
      )}
    </div>
  );
};

export default InputGroup;
