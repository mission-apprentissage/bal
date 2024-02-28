import { RadioButtons, RadioButtonsProps } from "@codegouvfr/react-dsfr/RadioButtons";
import { FC } from "react";
import { RadioOption } from "shared/helpers/cerfa/types/cerfa.types";

import { InputFieldProps } from "./InputField";

const RadioInput: FC<InputFieldProps> = ({
  name,
  fieldMethods,
  fieldSchema,
  state,
  stateRelatedMessage,
  inputProps,
}) => {
  const options = fieldSchema?.options as RadioOption[] | undefined;

  const radioOptions: RadioButtonsProps["options"] =
    options?.map((option) => ({
      label: option?.label ?? "",
      nativeInputProps: {
        ...inputProps,
        value: option.value,
        onChange: (e) => {
          inputProps?.onChange(e);
          fieldMethods.trigger(name);
        },
      },
    })) ?? [];

  return (
    <RadioButtons
      ref={inputProps?.ref}
      legend={fieldSchema.label}
      name={name}
      options={radioOptions}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      orientation="horizontal"
      disabled={inputProps.disabled}
    />
  );
};

export default RadioInput;
