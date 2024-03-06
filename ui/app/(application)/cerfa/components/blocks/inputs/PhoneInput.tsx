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
  const handleChange: PhoneInputProps["onChange"] = (val, country) => {
    fieldMethods.setValue(name, {
      value: `+${val}`,
      countryCode: "countryCode" in country ? country.countryCode : undefined,
    });
  };

  const handleBlur: PhoneInputProps["onBlur"] = (e) => {
    inputProps.onBlur(e);
    fieldMethods.trigger(name);
  };

  return (
    <FormPhoneInput
      label={fieldSchema.label}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      hintText={fieldSchema.placeholder}
      phoneInputProps={{
        inputProps: {
          ref: inputProps.ref,
          onBlur: handleBlur,
        },
        specialLabel: "",
        onChange: handleChange,
        country: "fr",
        masks: {
          fr: ". .. .. .. ..",
        },
        countryCodeEditable: false,
        enableTerritories: true,
        disableDropdown: true,
        placeholder: fieldSchema.placeholder,
      }}
      disabled={inputProps.disabled}
    />
  );
};

export default PhoneInput;
