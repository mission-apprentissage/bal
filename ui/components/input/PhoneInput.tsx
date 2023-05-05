import { InputProps } from "@chakra-ui/react";
import React, { FC } from "react";
import PInput, { CountryData, PhoneInputProps } from "react-phone-input-2";

import { InputWrapper } from "./InputWrapper";

interface Status {
  locked?: boolean;
  error?: boolean;
  success?: boolean;
}

interface Props extends Omit<InputProps, "onChange">, Status {
  locked?: boolean;
  value: string;
  onChange?: (value: string, country: { countryCode: string }) => void;
}

const getStatusClass = (props: Status) => {
  if (props.locked) return "disabled";
  if (props.error) return "error";
  if (props.success) return "valid";
};

export const PhoneInput: FC<Props> = (props) => {
  const { name, onChange, locked } = props;
  const value = props.value.replace("+", "");

  const handleChange: PhoneInputProps["onChange"] = (val, country) => {
    const value = `+${val}`;
    const { countryCode } = country as CountryData;

    onChange?.(value, { countryCode });
  };

  return (
    <InputWrapper {...props}>
      <PInput
        {...{ name }}
        value={value}
        country="fr"
        masks={{
          fr: ". .. .. .. ..",
        }}
        countryCodeEditable={false}
        onChange={handleChange}
        disabled={locked}
        inputClass={`phone-form-input ${getStatusClass(props)}`}
        buttonClass={`phone-form-button ${getStatusClass(props)}`}
      />
    </InputWrapper>
  );
};
