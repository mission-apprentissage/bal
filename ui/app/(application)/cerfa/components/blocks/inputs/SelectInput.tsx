import { Select } from "@codegouvfr/react-dsfr/Select";
import { FC } from "react";
import { SelectNestedOption, SelectOption } from "shared/helpers/cerfa/types/cerfa.types";

import { InputFieldProps } from "./InputField";

const SelectInput: FC<InputFieldProps> = ({ fieldSchema, inputProps, state, stateRelatedMessage }) => {
  const { options } = fieldSchema;
  const groupedOptions = options && "name" in options[0] ? (options as SelectNestedOption[]) : undefined;
  const flatOptions = !groupedOptions ? (options as SelectOption[]) : undefined;

  return (
    <Select
      label={fieldSchema.label}
      nativeSelectProps={{ ...inputProps }}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    >
      <option value="">{fieldSchema.placeholder ?? "Sélectionnez une option"}</option>
      {groupedOptions
        ? groupedOptions?.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.options.map((option) => (
                <option key={option.label} value={option.value} disabled={option.locked}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))
        : flatOptions?.map((option) => (
            <option key={option.label} value={option.value} disabled={option.locked}>
              {option.label}
            </option>
          ))}
    </Select>
  );
};

export default SelectInput;
