import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const TextInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema } = props;

  return <Input label={fieldSchema.label} nativeInputProps={{ ...fieldMethods.register(name) }} />;
};

export default TextInput;
