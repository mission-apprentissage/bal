import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { FieldValues, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { useRecoilState } from "recoil";
import { CerfaField, FieldType } from "shared/helpers/cerfa/types/cerfa.types";

import { activeFieldState, fieldsState } from "../../../atoms/fields.atom";
import { informationMessagesState } from "../../../atoms/informationMessages.atom";
import { showOverlayState } from "../../../atoms/showOverlay.atom";
import {
  getFieldDeps,
  getFieldStateFromFormState,
  getInformationMessageMarginTop,
  validateField,
} from "../../../utils/form.utils";
import ConsentInput from "./ConsentInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import NumberStepperInput from "./NumberStepperInput";
import PhoneInput from "./PhoneInput";
import RadioInput from "./RadioInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

interface Props {
  name: string;
  fieldType: FieldType;
  fieldMethods: UseFormReturn<FieldValues, any, undefined>;
  fieldSchema: CerfaField;
}

export type InputFieldProps = Pick<Props, "name" | "fieldMethods" | "fieldSchema"> &
  Pick<InputProps, "state" | "stateRelatedMessage"> & {
    inputProps: UseFormRegisterReturn & { onFocus: () => void; type?: string };
  };

const TypesMapping: Record<FieldType, FC<InputFieldProps>> = {
  text: TextInput,
  number: NumberInput,
  numberStepper: NumberStepperInput,
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
  const [_activeField, setActiveField] = useRecoilState(activeFieldState);
  const [_showOverlay, setShowOverlay] = useRecoilState(showOverlayState);
  const [fields, setFields] = useRecoilState(fieldsState);

  if (!Component) {
    return (
      <Typography color="red">
        Not handled field {fieldProps.name} with type {fieldType}
      </Typography>
    );
  }

  const { name, fieldMethods, fieldSchema } = fieldProps;

  const inputProps = fieldMethods.register(name, {
    required: fieldSchema.required && fieldSchema.requiredMessage,
    deps: getFieldDeps(name),
    pattern: fieldSchema.pattern,
    validate: {
      loading: () => {
        if (fieldSchema.showsOverlay) {
          setShowOverlay(true);
        }

        return true;
      },
      controls: async (_, formValues) => {
        try {
          const validation = await validateField(name, formValues, fieldMethods, setFields);

          return validation;
        } catch (e) {
          console.error(e);
          return "Une erreur technique est survenue";
        } finally {
          setShowOverlay(false);
        }
      },
    },
  });

  const onFocus = () => {
    setInformationMessages(fieldSchema.messages);
    setActiveField(name);
    fieldMethods.clearErrors(name);
  };

  const { state, stateRelatedMessage } = getFieldStateFromFormState(fieldMethods.formState, fields, name);

  return (
    <>
      <Box display="flex" alignItems="flex-start">
        <Box flexGrow={1}>
          <Component
            {...fieldProps}
            fieldSchema={fieldSchema}
            inputProps={{
              ...inputProps,
              disabled: fieldSchema.locked,
              onFocus,
              // type: fieldSchema.fieldType
            }}
            state={state}
            stateRelatedMessage={stateRelatedMessage}
          />
          {/* Trigger input margin bottom */}
          <Box />
        </Box>
        <Box
          ml={2}
          mt={getInformationMessageMarginTop(fieldSchema)}
          bgcolor={fr.colors.decisions.background.alt.blueFrance.default}
          minWidth={name.endsWith("taux") ? 0 : 40}
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
    </>
  );
};

export default InputField;
