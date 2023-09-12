import { Input as ChackraInput, InputProps } from "@chakra-ui/react";
import { ChangeEvent, FC, RefObject, useMemo, useRef } from "react";
import { IMask, IMaskMixin } from "react-imask";

export interface MaskBlock {
  name?: string;
  mask?:
    | string
    | typeof IMask.MaskedRange
    | typeof IMask.MaskedEnum
    | typeof IMask.MaskedPattern
    | typeof Number
    | RegExp;
  pattern?: string;
  placeholderChar?: string;
  radix?: string;
  mapToRadix?: string[];
  from?: number;
  to?: number;
  maxLength?: number;
  autofix?: boolean | "pad";
  lazy?: boolean;
  enum?: string[];
  signed?: boolean;
  normalizeZeros?: boolean;
  min?: number | string;
  max?: number | string;
  scale?: number;
}

interface Props extends InputProps {
  precision?: number;
  mask: string;
  maskBlocks?: MaskBlock[];
  unmask?: boolean;
  disabled?: boolean;
}

type Blocks = {
  [key: string]: MaskBlock;
};

export const MaskedInput: FC<Props> = (props) => {
  const {
    value,
    min,
    onChange,
    placeholder,
    name,
    minLength,
    maxLength,
    variant,
    precision,
    mask,
    maskBlocks,
    unmask,
    disabled,
  } = props;
  const inputRef = useRef(null);
  const blocks = useMemo(() => {
    return maskBlocks?.reduce((acc, item) => {
      if (!item.name) return acc;

      if (item.mask === "MaskedRange")
        acc[item.name] = {
          mask: IMask.MaskedRange,
          ...(item?.placeholderChar && {
            placeholderChar: item.placeholderChar,
          }),
          from: item.from,
          to: item.to,
          maxLength: item.maxLength,
          autofix: item.autofix,
          lazy: item.lazy,
        };
      else if (item.mask === "MaskedEnum")
        acc[item.name] = {
          mask: IMask.MaskedEnum,
          ...(item?.placeholderChar && {
            placeholderChar: item.placeholderChar,
          }),
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
          mask: item.pattern && new RegExp(item.pattern),
        };
      else
        acc[item.name] = {
          mask: item.mask,
          ...(item.placeholderChar ? { placeholderChar: item.placeholderChar } : {}),
        };
      return acc;
    }, {} as Blocks);
  }, [maskBlocks, min, precision]);

  const valueRef = useMemo(() => ({ current: value }), [value]);
  const focusRef = useRef(false);

  const handleComplete = (newValue: string) => {
    if (newValue !== value && focusRef.current === true) {
      onChange?.({
        target: { value: newValue },
        persist: () => {},
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <MInput
      name={name?.replaceAll(".", "_")}
      mask={mask}
      unmask={unmask ?? true}
      lazy={false}
      placeholderChar="_"
      autofix={true}
      blocks={blocks}
      isDisabled={disabled}
      onAccept={(currentValue) => (valueRef.current = currentValue)}
      onComplete={handleComplete}
      ref={inputRef}
      value={`${value}`}
      onBlur={() => {
        if (valueRef.current) {
          handleComplete(valueRef.current as string);
          focusRef.current = false;
        }
      }}
      onFocus={() => (focusRef.current = true)}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      variant={variant}
    />
  );
};

const MInput = IMaskMixin(({ inputRef, ...props }) => {
  const ref = inputRef as RefObject<HTMLInputElement>;
  const inputProps = props as InputProps;

  return <ChackraInput {...inputProps} ref={ref} />;
});
