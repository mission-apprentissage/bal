import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const NumberInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema } = props;

  return (
    <Input
      label={fieldSchema.label}
      nativeInputProps={{
        ...fieldMethods.register(name),
        inputMode: "numeric",
        pattern: "[0-9]*",
        type: "number",
      }}
    />
  );
};

export default NumberInput;
