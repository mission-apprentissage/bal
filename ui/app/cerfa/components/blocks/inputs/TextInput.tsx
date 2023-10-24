import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { InputFieldProps } from "./InputField";
import TextMaskInput from "./TextMaskInput";

const TextInput: FC<InputFieldProps> = (props) => {
  const { fieldSchema, inputProps, state, stateRelatedMessage } = props;

  if (fieldSchema.mask) {
    return <TextMaskInput {...props} />;
  }

  return (
    <Input
      label={fieldSchema.label}
      nativeInputProps={{
        ...inputProps,
      }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  );
};

export default TextInput;
