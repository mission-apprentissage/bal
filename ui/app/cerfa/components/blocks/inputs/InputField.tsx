import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { FieldValues, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { useRecoilState } from "recoil";

import { informationMessagesState } from "../../../atoms/informationMessages.atom";
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
    inputProps: UseFormRegisterReturn & { onFocus: () => void };
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
  const [_, setInformationMessages] = useRecoilState(informationMessagesState);

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

  const onFocus = () => {
    setInformationMessages(fieldSchema.messages);
  };

  const { state, stateRelatedMessage } = getFieldStateFromFormState(fieldMethods.formState, name);

  return (
    <Box display="flex" alignItems="flex-start">
      <Box flexGrow={1}>
        <Component
          {...fieldProps}
          fieldSchema={fieldSchema}
          inputProps={{ ...inputProps, onFocus }}
          state={state}
          stateRelatedMessage={stateRelatedMessage}
        />
        {/* Trigger input margin bottom */}
        <Box />
      </Box>
      <Box
        ml={2}
        mt={fieldSchema.fieldType === "phone" ? 7 : 4}
        bgcolor={fr.colors.decisions.background.alt.blueFrance.default}
        minWidth={40}
      >
        {fieldSchema.messages && (
          <Button
            type="button"
            iconId="ri-information-line"
            onClick={onFocus}
            priority="tertiary no outline"
            title="Informations complémentaires"
          />
        )}
      </Box>
    </Box>
  );
};

export default InputField;
