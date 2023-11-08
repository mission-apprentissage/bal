import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Typography } from "@mui/material";
import { FC } from "react";
import { FieldValues, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";

import { CerfaControl } from "../../../controls";
import cerfaSchema, { CerfaField } from "../../../utils/cerfaSchema";
import { getFieldStateFromFormState } from "../../../utils/form.utils";
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
  inputProps?: UseFormRegisterReturn;
  controls: CerfaControl[];
}

export type InputFieldProps = Omit<Props, "fieldType" | "controls"> & Pick<InputProps, "state" | "stateRelatedMessage">;

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

const InputField: FC<Props> = ({ fieldType, controls, ...fieldProps }) => {
  const Component = TypesMapping[fieldType];

  if (!Component) {
    return (
      <Typography color="red">
        Not handled field {fieldProps.name} with type {fieldType}
      </Typography>
    );
  }

  const { name, fieldMethods, fieldSchema } = fieldProps;
  const deps = controls?.map((control) => control.deps).flat() ?? [];

  const inputProps = fieldMethods.register(name, {
    required: fieldSchema.required && fieldSchema.requiredMessage,
    // @ts-ignore
    deps: [...new Set(deps)],
    validate: {
      controls: async (value, formValues) => {
        try {
          let error: string | undefined = undefined;

          for (const control of controls ?? []) {
            const validation = await control.process({ values: formValues, fields: cerfaSchema.fields });

            if (validation?.error) {
              error = validation.error;
            }

            if (validation?.cascade) {
              Object.entries(validation.cascade).forEach(([fieldName, cascade]) => {
                if (cascade?.value) {
                  fieldMethods.setValue(fieldName, cascade.value);
                }
              });
            }
          }

          return error;
        } catch (e) {
          return "Une erreur technique est survenue";
        }
      },
    },
  });

  const { state, stateRelatedMessage } = getFieldStateFromFormState(fieldMethods.formState, name);

  return <Component {...fieldProps} inputProps={inputProps} state={state} stateRelatedMessage={stateRelatedMessage} />;
};

export default InputField;
