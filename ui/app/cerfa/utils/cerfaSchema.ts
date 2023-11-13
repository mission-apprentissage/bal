import { apprentiSchema } from "../components/blocks/apprenti/apprentiSchema";
import { contratSchema } from "../components/blocks/contrat/contratSchema";
import { employeurSchema } from "../components/blocks/employeur/employeurSchema";
import { formationSchema } from "../components/blocks/formation/formationSchema";
import { FieldType } from "../components/blocks/inputs/InputField";
import { maitreApprentissageSchema } from "../components/blocks/maitreApprentissage/maitreApprentissageSchema";
import { CerfaControl, controls } from "../controls";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectNestedOption {
  name: string;
  options: SelectOption[];
}

export interface RadioOption {
  label: string;
  value: string | number;
}

type SelectOptions = SelectOption[] | SelectNestedOption[] | RadioOption[];

export interface CerfaField {
  required?: boolean;
  showInfo?: boolean;
  fieldType?: FieldType;
  label?: string;
  requiredMessage?: string;
  validateMessage?: string;
  precision?: number;
  min?: number;
  mask?: string;
  unmask?: boolean;
  maskBlocks?: {
    name: string;
    mask?: string;
    pattern?: string;
    placeholderChar?: string;
    from?: number;
    to?: number;
    maxLength?: number;
    enum?: string[];
    normalizeZeros?: boolean;
    max?: number;
    signed?: boolean;
  }[];
  minLength?: number;
  maxLength?: number;
  options?: SelectOptions;
}

interface CerfaFields {
  [key: string]: CerfaField;
}

interface CerfaSchema {
  fields: CerfaFields;
  logics: CerfaControl[];
}

const cerfaSchema: CerfaSchema = {
  // @ts-expect-error: todo
  fields: {
    ...employeurSchema,
    ...maitreApprentissageSchema,
    ...apprentiSchema,
    ...contratSchema,
    ...formationSchema,
  },
  logics: controls,
};

export const indexedDependencies = (() => {
  const names = {};
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
