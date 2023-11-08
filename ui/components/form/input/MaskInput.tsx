import { fr } from "@codegouvfr/react-dsfr/fr";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import React, { forwardRef, memo, useId } from "react";
import { IMaskInput, IMaskInputProps } from "react-imask";
import { symToStr } from "tsafe/symToStr";

import InputGroup from "./InputGroup";

interface Props extends InputProps.RegularInput {
  maskInputProps: IMaskInputProps<HTMLInputElement>;
}

/**
 * @see <https://components.react-dsfr.codegouv.studio/?path=/docs/components-input>
 * This is a more composable version to make custom components
 * */
export const MaskInput = memo(
  forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
      disabled = false,
      iconId,
      classes = {},
      state = "default",
      textArea: _textArea,
      nativeTextAreaProps: _nativeTextAreaProps,
      nativeInputProps,
      maskInputProps,
      ...rest
    } = props;

    const inputId = (function useClosure() {
      const id = useId();

      return nativeInputProps?.id ?? `input-${id}`;
    })();

    const messageId = `${inputId}-desc-error`;

    const { onChange: _, ref: inputRef, ...nativeInputPropsRest } = nativeInputProps ?? {};

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
        {(() => {
          const maskInput = (
            <IMaskInput
              {...(nativeInputPropsRest as object)}
              /* @ts-ignore */
              inputRef={inputRef}
              id={inputId}
              disabled={disabled || undefined}
              aria-describedby={messageId}
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
              {...maskInputProps}
            />
          );

          return iconId === undefined ? maskInput : <div className={fr.cx("fr-input-wrap", iconId)}>{maskInput}</div>;
        })()}
      </InputGroup>
    );
  })
);

MaskInput.displayName = symToStr({ MaskInput });

export default MaskInput;
