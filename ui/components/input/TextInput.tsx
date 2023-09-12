import { Input as ChackraInput } from "@chakra-ui/react";
import React, { ChangeEventHandler, FC } from "react";

import { InputWrapper } from "./InputWrapper";
import { MaskBlock, MaskedInput } from "./MaskedInput";

interface Props {
  name: string;
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  error: string;
  example?: string;
  description?: string;
  locked?: boolean;
  fieldType?: "text" | "number";
  mask?: string;
  maskBlocks?: MaskBlock[];
  unmask?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  precision?: number;
  placeholder?: string;
}

export const TextInput: FC<Props> = (props) => {
  const {
    name,
    onChange,
    error,
    example,
    description,
    locked,
    fieldType,
    mask,
    maskBlocks,
    unmask,
    minLength,
    maxLength,
    min,
    max,
    precision,
    placeholder,
  } = props;
  const value = `${props.value}`;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    if (fieldType === "number") {
      if (precision) {
        onChange(val === "" ? undefined : parseFloat(val));
      } else {
        onChange(val === "" ? undefined : parseInt(val));
      }
      return;
    }
    onChange(val);
  };

  return (
    <InputWrapper {...props}>
      {mask ? (
        <MaskedInput
          variant="cerfa"
          isInvalid={!!error}
          name={name.replaceAll(".", "_")}
          type={fieldType}
          disabled={locked}
          onChange={handleChange}
          value={value}
          placeholder={placeholder ? placeholder : example ? `Exemple : ${example}` : description}
          mask={mask}
          maskBlocks={maskBlocks}
          unmask={unmask}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          precision={precision}
        />
      ) : (
        <ChackraInput
          variant="cerfa"
          isInvalid={!!error}
          name={name.replaceAll(".", "_")}
          type={fieldType}
          disabled={locked}
          step={1}
          onChange={handleChange}
          value={value}
          placeholder={placeholder ? placeholder : example ? `Exemple : ${example}` : description}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
        />
      )}
    </InputWrapper>
  );
};
