import { apprentiSchema } from "shared/helpers/cerfa/schema/apprentiSchema";
import { contratSchema } from "shared/helpers/cerfa/schema/contratSchema";
import { employeurSchema } from "shared/helpers/cerfa/schema/employeurSchema";
import { formationSchema } from "shared/helpers/cerfa/schema/formationSchema";
import { maitreApprentissageSchema } from "shared/helpers/cerfa/schema/maitreApprentissageSchema";
import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

import cerfaSchema from "./utils/cerfaSchema";
import { getValues, isEmptyValue } from "./utils/form.utils";

export const getFormStatus = ({ fields, values }: CerfaForm) => {
  const formErrors = getBlocErrors({ fields, values });

  const contratStatus = getContratCompletion(fields, "contrat", formErrors);
  const formationStatus = getBlocCompletion(Object.keys(formationSchema), fields, "formation", formErrors);
  const maitreStatus = getBlocCompletion(Object.keys(maitreApprentissageSchema), fields, "maitre", formErrors);
  const apprentiStatus = getBlocCompletion(Object.keys(apprentiSchema), fields, "apprenti", formErrors);
  const employeurStatus = getBlocCompletion(Object.keys(employeurSchema), fields, "employeur", formErrors);

  const cerfaTabCompletion =
    (contratStatus.completion +
      formationStatus.completion +
      maitreStatus.completion +
      apprentiStatus.completion +
      employeurStatus.completion) /
    5;

  return {
    contrat: contratStatus,
    formation: formationStatus,
    maitre: maitreStatus,
    apprenti: apprentiStatus,
    employeur: employeurStatus,
    complete: cerfaTabCompletion === 100,
    completion: cerfaTabCompletion,
    global: {
      errors: formErrors.reduce((acc, er) => ({ ...acc, [er.target]: er }), {}),
    },
  };
};

const getContratCompletion = (fields: any, values: any, formErrors: any) => {
  const requiredFieldNames = getRequiredFieldNames(Object.keys(contratSchema), fields);
  const invalidFields = getInvalidFields(requiredFieldNames, fields);
  const completion = calcCompletion({
    nbRequired: requiredFieldNames.length,
    nbBlocErrors: formErrors.filter((error: any) => error.target === "avantageNature").length,
    nbFieldErrors: invalidFields.length,
  });
  return {
    fieldErrors: invalidFields,
    complete: completion === 100,
    completion,
  };
};

const getBlocCompletion = (fieldNames: any, fields: any, blockName: any, formErrors: any) => {
  const requiredFieldNames = getRequiredFieldNames(fieldNames, fields);
  const invalidFields = getInvalidFields(requiredFieldNames, fields);

  const completion = calcCompletion({
    nbRequired: requiredFieldNames.length,
    nbBlocErrors: formErrors.filter((error: any) => error.blocCompletion === blockName).length,
    nbFieldErrors: invalidFields.length,
  });

  return {
    fieldErrors: invalidFields,
    complete: completion === 100,
    completion,
  };
};

const calcCompletion = ({ nbRequired, nbFieldErrors, nbBlocErrors }: any) =>
  Math.round(((nbRequired - nbFieldErrors) / (nbRequired + nbBlocErrors)) * 100);

const getRequiredFieldNames = (fieldNames: any, fields: any) => {
  const values = getValues(fields);
  return fieldNames.filter((current: any) => {
    if (current.includes("[]")) return false;
    const field = fields[current];
    if (!field) return false;
    if (field.completion === false) return false;
    if (field.completion) {
      return field.completion?.({ values });
    }
    return field.required;
  });
};

const getBlocErrors = ({ fields, values }: any) => {
  const blockErrors: any[] = [];
  cerfaSchema.logics.forEach((logic) => {
    if (!logic.target) return;
    // @ts-expect-error: todo
    const { error } = logic.process({ values, fields }) ?? {};
    if (error) {
      blockErrors.push({
        target: logic.target,
        error,
        blocCompletion: logic.blocCompletion,
        deps: logic.deps,
        touched: logic.deps.some((dep) => fields[dep].touched),
      });
    }
  });
  return blockErrors;
};

const getInvalidFields = (fieldNames: string[], fields: any) => {
  return fieldNames
    .filter((name) => {
      const field = fields[name];
      if (!field) return false;
      return isEmptyValue(field.value) || !field.success || field.error;
    })
    .map((name) => fields[name]);
};
