import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const DateInput: FC<InputFieldProps> = ({ fieldSchema, state, stateRelatedMessage, inputProps }) => {
  return (
    <Input
      label={fieldSchema.label}
      nativeInputProps={{ ...inputProps, placeholder: fieldSchema.placeholder, type: "date", max: "9999-12-31" }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    />
  );
};

export default DateInput;
