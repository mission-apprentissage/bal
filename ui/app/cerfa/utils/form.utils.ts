import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { differenceInYears, parseISO } from "date-fns";
import { get, setWith } from "lodash";
import { FieldError, FieldErrorsImpl, FieldValues, FormState, Merge, UseFormReturn } from "react-hook-form";
import { SetterOrUpdater } from "recoil";

import { CerfaForm } from "../components/CerfaForm";
import cerfaSchema, { CerfaField, indexedRules, InformationMessage } from "./cerfaSchema";

export const caclAgeAtDate = (dateNaissanceString: string, dateString: string) => {
  const dateNaissance = parseISO(dateNaissanceString);
  const dateObj = parseISO(dateString);

  // Note: differenceInYears already gives a whole number
  const years = differenceInYears(dateObj, dateNaissance);
  const age = years > 0 ? years : 0;

  return {
    age,
    exactAge: age, // since differenceInYears already returns a whole number
  };
};

export interface FieldState {
  state?: InputProps["state"];
  stateRelatedMessage?: string;
  informationMessages?: InformationMessage[];
}

export const getFieldStateFromFormState = (
  formState: FormState<CerfaForm>,
  fieldsState: Record<string, FieldState | undefined>,
  name: string
): FieldState => {
  const state = get(fieldsState, name)?.state || (get(formState.errors, name) ? "error" : "default");
  const stateRelatedMessage =
    get(fieldsState, name)?.stateRelatedMessage || get(formState.errors, name)?.message?.toString();

  return { state, stateRelatedMessage };
};

export const getFieldDeps = (name: string) => {
  const deps = indexedRules[name]?.map((control) => control.deps) ?? [];
  return [...new Set(deps.flat())];
};

export const validateField = async (
  name: string,
  formValues: FieldValues,
  fieldMethods: UseFormReturn<FieldValues>,
  setFields: SetterOrUpdater<Record<string, FieldState | undefined>>
) => {
  const { setValue, resetField } = fieldMethods;
  const controls = indexedRules[name];
  let error: string | undefined = undefined;

  for (const control of controls ?? []) {
    const validation = await control.process({ values: formValues, fields: cerfaSchema.fields });

    if (validation?.error) {
      error = validation.error;
    }

    if (validation?.cascade) {
      Object.entries(validation.cascade).forEach(([fieldName, cascade]) => {
        if (cascade?.success) {
          setFields((fields) => ({
            ...fields,
            [fieldName]: { state: "success", stateRelatedMessage: cascade.stateRelatedMessage },
          }));
        }
        if (cascade?.informationMessages) {
          setFields((fields) => ({
            ...fields,
            [fieldName]: { ...fields[fieldName], informationMessages: cascade.informationMessages },
          }));
        }
        if (cascade?.value) {
          const shouldValidate = cascade?.cascade ?? true;
          setValue(fieldName, cascade.value, { shouldValidate });
        }
        if (validation?.reset) {
          resetField(fieldName);
        }
      });
    }
  }

  return error;
};

export const getValues = (fields: any) => {
  if (!fields) return undefined;
  const values = {};
  Object.entries(fields).forEach(([key, field]) => {
    // @ts-expect-error: todo
    setWith(values, key, field.value);
  });
  return values;
};

export const isEmptyValue = (value: any) => value === "" || value === undefined || value === null;

export const downloadFile = (data: string, filename: string) => {
  const a = document.createElement("a");
  a.href = data;
  a.download = filename;
  a.click();

  return a;
};

export const getInformationMessageMarginTop = (fieldSchema: CerfaField) => {
  switch (fieldSchema.fieldType) {
    case "phone":
      return 7;
    case "consent":
      return 0;
    default:
      return 4;
  }
};

export const isFieldError = (
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
): error is FieldError => {
  if (!error) return false;
  return "type" in error && "message" in error;
};

export const countBlockErrors = (errors: FormState<FieldValues>["errors"]) => {
  let count = 0;

  Object.entries(errors).forEach(([_, value]) => {
    if (isFieldError(value as FieldError)) {
      count++;
    } else {
      count += countBlockErrors(value as FormState<FieldValues>["errors"]);
    }
  });

  return count;
};
