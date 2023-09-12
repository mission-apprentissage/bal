import { HStack, Radio, RadioGroup, RadioProps } from "@chakra-ui/react";
import React, { ChangeEventHandler, FC, useMemo } from "react";

interface Option {
  label: string;
  value: string;
  locked?: boolean;
}

interface Props extends Omit<RadioProps, "onChange"> {
  locked?: boolean;
  options: Option[];
  onChange: (value: string | undefined) => void;
}

export const RadioInput: FC<Props> = (props) => {
  const { name, onChange, value, locked, options = [] } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    let newValue = e.target.value;
    newValue = labelValueMap[newValue];

    onChange?.(newValue);
  };

  const { labelValueMap, valueLabelMap } = useMemo(() => {
    return {
      labelValueMap: Object.fromEntries(options.map((option) => [option.label, option.value])),
      valueLabelMap: Object.fromEntries(options.map((option) => [option.value, option.label])),
    };
  }, [options]);

  return (
    <HStack>
      <RadioGroup value={value ? valueLabelMap[value] ?? "" : ""} name={name}>
        <HStack>
          {options.map((option, k) => {
            return (
              <Radio
                key={k}
                name={name}
                value={option.label}
                onChange={handleChange}
                isDisabled={option.locked || locked}
              >
                {option.label}
              </Radio>
            );
          })}
        </HStack>
      </RadioGroup>
    </HStack>
  );
};
