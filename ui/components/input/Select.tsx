import { Select as ChakraSelect, SelectProps } from "@chakra-ui/react";
import React, { ChangeEventHandler, FC, useMemo } from "react";

import { InputWrapper } from "./InputWrapper";

interface Option {
  label: string;
  value: string;
  locked?: boolean;
}

interface Option {
  options: Option[];
  name: string;
}

interface Props extends Omit<SelectProps, "onChange"> {
  locked?: boolean;
  options: Option[];
  onChange: (value: string | undefined) => void;
}

export const Select: FC<Props> = (props) => {
  const { name, locked, onChange, value, options, placeholder } = props;

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selectedLabel = event.target.value ?? undefined;
    const selectedValue = labelValueMap[selectedLabel];

    onChange?.(selectedValue);
  };

  const { labelValueMap, valueLabelMap } = useMemo(() => {
    const flatOptions = options[0].options
      ? options.flatMap((group) => group.options)
      : options;
    return {
      labelValueMap: Object.fromEntries(
        flatOptions.map((option) => [option.label, option.value])
      ),
      valueLabelMap: Object.fromEntries(
        flatOptions.map((option) => [option.value, option.label])
      ),
    };
  }, [options]);

  const selectedLabel = value ? valueLabelMap[value as string] : undefined;

  return (
    <InputWrapper {...props}>
      <ChakraSelect
        name={name}
        disabled={locked}
        // variant={validated ? "valid" : "outline"}
        onClick={(e) => e.stopPropagation()}
        onChange={handleChange}
        iconColor="gray.800"
        data-testid={`select-${name}`}
        placeholder={placeholder ?? "Sélectionner une option"}
        value={selectedLabel ?? ""}
        variant="cerfa"
      >
        {options[0].options ? (
          <>
            {options.map((group, k) => {
              return (
                <optgroup label={group.name} key={k}>
                  {group.options.map((option, j) => {
                    return (
                      <option
                        key={j}
                        value={option.label}
                        disabled={option.locked}
                      >
                        {option.label}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </>
        ) : (
          <>
            {options.map((option, j) => {
              return (
                <option key={j} value={option.label} disabled={option.locked}>
                  {option.label}
                </option>
              );
            })}
          </>
        )}
      </ChakraSelect>
    </InputWrapper>
  );
};
