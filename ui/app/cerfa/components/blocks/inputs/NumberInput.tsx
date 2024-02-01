import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";
import TextMaskInput from "./TextMaskInput";

const NumberInput: FC<InputFieldProps> = (props) => {
  const { fieldSchema, inputProps, state, stateRelatedMessage } = props;

  if (fieldSchema.mask) {
    return (
      <TextMaskInput
        {...props}
        inputProps={{
          ...inputProps,
          // type: "number",
        }}
      />
    );
  }

  return (
    <Input
      label={fieldSchema.label}
      nativeInputProps={{
        ...inputProps,
        inputMode: "numeric",
        pattern: "[0-9]*",
        type: "number",
        placeholder: fieldSchema.placeholder,
        min: fieldSchema.min,
        max: fieldSchema.max,
      }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    />
  );
};

export default NumberInput;
