import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const DateInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema } = props;

  return <Input label={fieldSchema.label} nativeInputProps={{ ...fieldMethods.register(name), type: "date" }} />;
};

export default DateInput;
