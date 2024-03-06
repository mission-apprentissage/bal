import cerfaFields from "shared/helpers/cerfa/schema";
import { CerfaSchema } from "shared/helpers/cerfa/types/cerfa.types";

import { controls } from "../controls";

const cerfaSchema: CerfaSchema = {
  fields: cerfaFields,
  logics: controls,
};

export const getFieldSchema = (name: string) => {
  if (name.startsWith("contrat.remunerationsAnnuelles")) {
    const fieldName = name.split(".").slice(-1)[0];

    return cerfaSchema.fields[`contrat.remunerationsAnnuelles[].${fieldName}`];
  }
  return cerfaSchema.fields[name];
};

export const indexedDependencies = (() => {
  const names: Record<string, any> = {};
  controls.forEach((rule) => {
    rule.deps.forEach((dep) => {
      rule.deps.forEach((depI) => {
        names[dep] = names[dep] ?? {};
        names[dep][depI] = true;
      });
      delete names[dep][dep];
    });
  });
  // @ts-expect-error
  return Object.fromEntries(Object.keys(names).reduce((acc, name) => [...acc, [name, Object.keys(names[name])]], []));
})();

export const indexedRules = Object.fromEntries(
  Object.keys(indexedDependencies).map((name) => [name, controls.filter((logic) => logic.deps.includes(name))])
);

export default cerfaSchema;
