import { FC, useMemo } from "react";
import { IMask } from "react-imask";

import MaskInput from "@/components/form/input/MaskInput";

import { InputFieldProps } from "./InputField";

const TextMaskInput: FC<InputFieldProps> = ({
  name,
  fieldMethods,
  fieldSchema,
  inputProps,
  state,
  stateRelatedMessage,
}) => {
  const { setValue } = fieldMethods;
  const { mask, maskBlocks, precision, min, minLength, maxLength } = fieldSchema;

  const blocks = useMemo(() => {
    return maskBlocks?.reduce(
      (acc, item) => {
        if (!item.name) return acc;
        if (item.mask === "MaskedRange")
          acc[item.name] = {
            mask: IMask.MaskedRange,
            ...(item?.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
            from: item.from,
            to: item.to,
            maxLength: item.maxLength,
          };
        else if (item.mask === "MaskedEnum")
          acc[item.name] = {
            mask: IMask.MaskedEnum,
            ...(item.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
            enum: item.enum,
            maxLength: item.maxLength,
          };
        else if (item.mask === "Number")
          acc[item.name] = {
            mask: Number,
            radix: ".", // fractional delimiter
            mapToRadix: [".", ","], // symbols to process as radix
            normalizeZeros: item.normalizeZeros,
            scale: precision,
            signed: item.signed,
            min: min,
            max: item.max,
          };
        else if (item.mask === "Pattern")
          acc[item.name] = {
            mask: item.pattern ? new RegExp(item.pattern) : undefined,
            maxLength: item.maxLength,
          };
        else
          acc[item.name] = {
            mask: item.mask,
            ...(item.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
          };
        return acc;
      },
      {} as Record<string, any>
    );
  }, [maskBlocks, min, precision]);

  return (
    <MaskInput
      label={fieldSchema.label}
      nativeInputProps={{
        ...inputProps,
        minLength,
        maxLength,
        placeholder: fieldSchema.placeholder,
      }}
      maskInputProps={{
        mask,
        onAccept: (value) => {
          setValue(name, value);
        },
        onComplete: (value) => {
          setValue(name, value);
        },
        lazy: fieldSchema?.maskLazy ?? true,
        blocks,
        placeholder: fieldSchema.placeholder,
        disabled: inputProps.disabled,
        definitions: fieldSchema.definitions ?? {},
      }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    />
  );
};

export default TextMaskInput;
