import {
  Checkbox,
  CheckboxProps,
  Text,
  UseCheckboxProps,
} from "@chakra-ui/react";
import React, { FC } from "react";

import { Check } from "../../theme/icons/Check";

interface Props extends Omit<CheckboxProps, "onChange"> {
  locked?: boolean;
  label: string;
  onChange: (value: true | undefined) => void;
}

export const ConsentInput: FC<Props> = (props) => {
  const { name, onChange, value, locked, label, isRequired } = props;
  const handleChange: UseCheckboxProps["onChange"] = (e) => {
    onChange(e.target.checked || undefined);
  };

  return (
    <Checkbox
      name={name}
      onChange={handleChange}
      value="true"
      isChecked={value === "true"}
      isDisabled={locked}
      icon={<Check />}
    >
      {label}
      {isRequired && (
        <Text as="span" color="red.500" ml={1}>
          *
        </Text>
      )}
    </Checkbox>
  );
};
