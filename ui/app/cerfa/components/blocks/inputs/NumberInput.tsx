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
      }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  );
};

export default NumberInput;
