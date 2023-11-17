import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Typography } from "@mui/material";
import { FC } from "react";
import { FieldValues, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";

import { CerfaField } from "../../../utils/cerfaSchema";
import { getFieldDeps, getFieldStateFromFormState, validateField } from "../../../utils/form.utils";
import ConsentInput from "./ConsentInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import PhoneInput from "./PhoneInput";
import RadioInput from "./RadioInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "radio"
  | "email"
  | "date"
  | "numberStepper"
  | "consent"
  | "phone";

interface Props {
  name: string;
  fieldType: FieldType;
  fieldMethods: UseFormReturn<FieldValues, any, undefined>;
  fieldSchema: CerfaField;
}

export type InputFieldProps = Pick<Props, "name" | "fieldMethods" | "fieldSchema"> &
  Pick<InputProps, "state" | "stateRelatedMessage"> & {
    inputProps: UseFormRegisterReturn;
  };

const TypesMapping: Record<FieldType, FC<InputFieldProps>> = {
  text: TextInput,
  number: NumberInput,
  numberStepper: NumberInput,
  email: TextInput,
  phone: PhoneInput,
  date: DateInput,
  radio: RadioInput,
  select: SelectInput,
  consent: ConsentInput,
} as const;

const InputField: FC<Props> = ({ fieldType, ...fieldProps }) => {
  const Component = TypesMapping[fieldType];

  if (!Component) {
    return (
      <Typography color="red">
        Not handled field {fieldProps.name} with type {fieldType}
      </Typography>
    );
  }

  const { name, fieldMethods, fieldSchema: initialFieldSchema } = fieldProps;

  const fieldSchema = initialFieldSchema ?? {
    fieldType: "text",
  };

  const inputProps = fieldMethods.register(name, {
    required: fieldSchema.required && fieldSchema.requiredMessage,
    deps: getFieldDeps(name),
    validate: {
      controls: async (_, formValues) => {
        try {
          return validateField(name, formValues, fieldMethods);
        } catch (e) {
          console.error(e);
          return "Une erreur technique est survenue";
        }
      },
    },
  });

  const { state, stateRelatedMessage } = getFieldStateFromFormState(fieldMethods.formState, name);

  return (
    <Component
      {...fieldProps}
      fieldSchema={fieldSchema}
      inputProps={inputProps}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  );
};

export default InputField;
