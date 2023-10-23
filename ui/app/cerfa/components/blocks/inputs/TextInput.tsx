import Input from "@codegouvfr/react-dsfr/Input";
import { FC } from "react";

import { getFieldStateFromFormState } from "../../../utils/form.utils";
import { InputFieldProps } from "./InputField";
import TextMaskInput from "./TextMaskInput";

const TextInput: FC<InputFieldProps> = (props) => {
  const {
    name,
    fieldMethods: { formState },
    fieldSchema,
    inputProps,
  } = props;
  const { state, stateRelatedMessage } = getFieldStateFromFormState(formState, name);

  if (fieldSchema.mask) {
    return <TextMaskInput {...props} />;
  }

  return (
    <>
      <Input
        label={fieldSchema.label}
        nativeInputProps={{
          ...inputProps,
        }}
        state={state}
        stateRelatedMessage={stateRelatedMessage}
      />
    </>
  );
};

export default TextInput;
