import { Select } from "@codegouvfr/react-dsfr/Select";
import { FC } from "react";

import { SelectNestedOption, SelectOption } from "../../../utils/cerfaSchema";
import { InputFieldProps } from "./InputField";

const SelectInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema } = props;

  const { options } = fieldSchema;
  const groupedOptions = options && "name" in options[0] ? (options as SelectNestedOption[]) : undefined;
  const flatOptions = !groupedOptions ? (options as SelectOption[]) : undefined;

  return (
    <Select
      label={fieldSchema.label}
      nativeSelectProps={{ ...fieldMethods.register(name) }}
      style={{
        marginBottom: "1.5rem",
      }}
    >
      {groupedOptions
        ? groupedOptions?.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.options.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))
        : flatOptions?.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
    </Select>
  );
};

export default SelectInput;
