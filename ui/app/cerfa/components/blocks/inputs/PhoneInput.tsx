import { FC } from "react";
import { PhoneInputProps } from "react-phone-input-2";

import FormPhoneInput from "@/components/form/input/PhoneInput";

import { InputFieldProps } from "./InputField";

const PhoneInput: FC<InputFieldProps> = ({
  name,
  fieldMethods,
  fieldSchema,
  inputProps,
  state,
  stateRelatedMessage,
}) => {
  const value = fieldMethods.getValues()?.[name]?.value?.replace("+", "") ?? "";

  const handleChange: PhoneInputProps["onChange"] = (val, country) => {
    fieldMethods.setValue(name, {
      value: `+${val}`,
      countryCode: "countryCode" in country ? country.countryCode : undefined,
    });
  };

  return (
    <FormPhoneInput
      {...inputProps}
      label={fieldSchema.label}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      hintText={fieldSchema.placeholder}
      phoneInputProps={{
        specialLabel: "",
        onChange: handleChange,
        value,
        country: "fr",
        masks: {
          fr: ". .. .. .. ..",
        },
        countryCodeEditable: false,
        enableTerritories: true,
        placeholder: fieldSchema.placeholder,
      }}
    />
  );
};

export default PhoneInput;
