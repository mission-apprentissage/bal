import { fr } from "@codegouvfr/react-dsfr";
import { FC } from "react";
import PInput, { PhoneInputProps } from "react-phone-input-2";

import { InputFieldProps } from "./InputField";

const PhoneInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema: _ } = props;
  const value = fieldMethods.getValues()?.[name]?.value?.replace("+", "") ?? "";

  const handleChange: PhoneInputProps["onChange"] = (val, country) => {
    console.log({ val, country });
    fieldMethods.setValue(name, {
      value: `+${val}`,
      countryCode: "countryCode" in country ? country.countryCode : undefined,
    });
  };

  return (
    <PInput
      {...fieldMethods.register(name)}
      inputClass={fr.cx("fr-input")}
      onChange={handleChange}
      value={value}
      country={"fr"}
      masks={{
        fr: ". .. .. .. ..",
      }}
      countryCodeEditable={false}
      enableTerritories={true}
      // disabled={locked}
      // inputClass={`phone-form-input ${getStatusClass(props)}`}
      // buttonClass={`phone-form-button ${getStatusClass(props)}`}
    />
  );
};

export default PhoneInput;
