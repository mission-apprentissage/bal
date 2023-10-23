import { InputProps } from "@codegouvfr/react-dsfr/Input";
import { differenceInYears, parseISO } from "date-fns";
import { get, setWith } from "lodash";
import { FormState } from "react-hook-form";

import { CerfaForm } from "../components/CerfaForm";

// luxon
// export const caclAgeAtDate = (dateNaissanceString: string, dateString: string) => {
//   const dateNaissance = DateTime.fromISO(dateNaissanceString).setLocale("fr-FR");
//   const dateObj = DateTime.fromISO(dateString).setLocale("fr-FR");
//   const diffInYears = dateObj.diff(dateNaissance, "years");
//   const { years } = diffInYears.toObject();
//   const age = years ? Math.floor(years) : 0;
//   return {
//     age,
//     exactAge: years,
//   };
// };

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

interface FieldState {
  state: InputProps["state"];
  stateRelatedMessage: string | undefined;
}

export const getFieldStateFromFormState = (formState: FormState<CerfaForm>, name: string): FieldState => {
  const state = get(formState.errors, name) ? "error" : "default";
  const stateRelatedMessage = get(formState.errors, name)?.message?.toString();

  return { state, stateRelatedMessage };
};

export const getValues = (fields: any) => {
  if (!fields) return undefined;
  const values = {};
  Object.entries(fields).forEach(([key, field]) => {
    setWith(values, key, field.value);
  });
  return values;
};

export const isEmptyValue = (value: any) => value === "" || value === undefined || value === null;
