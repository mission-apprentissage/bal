import { RadioButtons, RadioButtonsProps } from "@codegouvfr/react-dsfr/RadioButtons";
import { FC } from "react";

import { RadioOption } from "../../../utils/cerfaSchema";
import { InputFieldProps } from "./InputField";

const RadioInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema } = props;

  const options = fieldSchema?.options as RadioOption[] | undefined;

  const radioOptions: RadioButtonsProps["options"] =
    options?.map((option) => ({
      label: option?.label ?? "",
      nativeInputProps: {
        value: option.value,
        onChange: () => {
          fieldMethods.setValue(name, option.value);
        },
      },
    })) ?? [];

  return (
    <RadioButtons
      legend={fieldSchema.label}
      name={name}
      options={radioOptions}
      // state="default"
      // stateRelatedMessage="State description"
    />
  );
};

export default RadioInput;
