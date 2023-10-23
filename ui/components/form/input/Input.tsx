import { fr } from "@codegouvfr/react-dsfr/fr";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import React, { forwardRef, memo, useId } from "react";
import { symToStr } from "tsafe/symToStr";

import InputGroup from "./InputGroup";

/**
 * @see <https://components.react-dsfr.codegouv.studio/?path=/docs/components-input>
 * This is a more composable version to make custom components
 * */
export const Input = memo(
  forwardRef<HTMLDivElement, InputProps>((props, ref) => {
    const {
      disabled = false,
      iconId,
      classes = {},
      state = "default",
      textArea = false,
      nativeTextAreaProps,
      nativeInputProps,
      ...rest
    } = props;

    const nativeInputOrTextAreaProps = (textArea ? nativeTextAreaProps : nativeInputProps) ?? {};

    const NativeInputOrTextArea = textArea ? "textarea" : "input";

    const inputId = (function useClosure() {
      const id = useId();

      return nativeInputOrTextAreaProps.id ?? `input-${id}`;
    })();

    const messageId = `${inputId}-desc-error`;

    return (
      <InputGroup
        nativeInputProps={nativeInputProps}
        disabled={disabled}
        state={state}
        classes={classes}
        ref={ref}
        inputId={inputId}
        messageId={messageId}
        {...rest}
      >
        TEXT
        {(() => {
          const nativeInputOrTextArea = (
            <NativeInputOrTextArea
              {...(nativeInputOrTextAreaProps as object)}
              className={cx(
                fr.cx(
                  "fr-input",
                  (() => {
                    switch (state) {
                      case "error":
                        return "fr-input--error";
                      case "success":
                        return "fr-input--valid";
                      case "default":
                        return undefined;
                    }
                  })()
                ),
                classes.nativeInputOrTextArea
              )}
              disabled={disabled || undefined}
              aria-describedby={messageId}
              type={textArea ? undefined : nativeInputProps?.type ?? "text"}
              id={inputId}
            />
          );

          return iconId === undefined ? (
            nativeInputOrTextArea
          ) : (
            <div className={fr.cx("fr-input-wrap", iconId)}>{nativeInputOrTextArea}</div>
          );
        })()}
      </InputGroup>
    );
  })
);

Input.displayName = symToStr({ Input });

export default Input;
