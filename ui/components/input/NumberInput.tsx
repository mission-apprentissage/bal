import {
  InputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  UseCounterProps,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

import { InputWrapper } from "./InputWrapper";

interface Props extends Omit<InputProps, "onChange"> {
  error?: string;
  example?: string;
  description?: string;
  locked?: boolean;
  fieldType?: "text" | "number";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  precision?: number;
  onChange?: (value: number | undefined) => void;
}

export const NumberInput: FC<Props> = (props) => {
  const {
    name,
    onChange,
    error,
    example,
    description,
    locked,
    fieldType,
    minLength,
    maxLength,
    min,
    max,
    precision = 2,
  } = props;

  const [localValue, setLocalValue] = useState(props.value);

  useEffect(() => {
    if (
      localValue &&
      props.value &&
      typeof props.value === "string" &&
      parseFloat(props.value) === parseFloat(`${localValue}`)
    )
      return;
    setLocalValue(props.value);
  }, [setLocalValue, props.value]);

  const handleChange: UseCounterProps["onChange"] = (val) => {
    setLocalValue(val);
    if (!/\.$/.test(val) && val !== "") {
      const value = parseFloat(val);
      onChange?.(value);
    }
  };

  return (
    <InputWrapper {...props}>
      <ChakraNumberInput
        precision={precision}
        w="100%"
        variant="cerfa"
        isInvalid={!!error}
        name={name?.replaceAll(".", "_")}
        {...{
          // TODO: check all these attributes are valid
          type: fieldType,
          disabled: locked,
          minLength,
          maxLength,
        }}
        onChange={handleChange}
        value={localValue as string}
        placeholder={example ? `Exemple : ${example}` : description}
        min={min}
        max={max}
      >
        <NumberInputField />
        {!locked && (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
      </ChakraNumberInput>
    </InputWrapper>
  );
};
