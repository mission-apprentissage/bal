import { fr } from "@codegouvfr/react-dsfr/fr";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { Box } from "@mui/material";
import React, { forwardRef, memo, useId } from "react";
import PInput, { PhoneInputProps } from "react-phone-input-2";

import InputGroup from "./InputGroup";

interface Props extends InputProps.RegularInput {
  phoneInputProps: PhoneInputProps;
}

/**
 * @see <https://components.react-dsfr.codegouv.studio/?path=/docs/components-input>
 * This is a more composable version to make custom components
 * */
export const PhoneInput = memo(
  forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
      disabled = false,
      iconId,
      classes = {},
      state = "default",
      textArea: _textArea,
      nativeTextAreaProps: _nativeTextAreaProps,
      nativeInputProps,
      phoneInputProps,
      ...rest
    } = props;

    const inputId = (function useClosure() {
      const id = useId();

      return nativeInputProps?.id ?? `input-${id}`;
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
        {(() => {
          const phoneInput = (
            <PInput
              specialLabel=""
              disabled={disabled}
              aria-describedby={messageId}
              inputClass={cx(
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
              {...phoneInputProps}
            />
          );

          return (
            <Box mt={1}>
              {iconId === undefined ? phoneInput : <div className={fr.cx("fr-input-wrap", iconId)}>{phoneInput}</div>}
            </Box>
          );
        })()}
      </InputGroup>
    );
  })
);

export default PhoneInput;
