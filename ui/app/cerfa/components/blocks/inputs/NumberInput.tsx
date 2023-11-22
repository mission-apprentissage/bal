import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const NumberInput: FC<InputFieldProps> = (props) => {
  const { fieldSchema, inputProps, state, stateRelatedMessage } = props;

  return (
    <Input
      label={fieldSchema.label}
      nativeInputProps={{
        ...inputProps,
        inputMode: "numeric",
        pattern: "[0-9]*",
        type: "number",
        placeholder: fieldSchema.placeholder,
      }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    />
  );
};

export default NumberInput;
