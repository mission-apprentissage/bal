import { apprentiSchema } from "../components/blocks/apprenti/apprentiSchema";
import { contratSchema } from "../components/blocks/contrat/contratSchema";
import { employeurSchema } from "../components/blocks/employeur/employeurSchema";
import { formationSchema } from "../components/blocks/formation/formationSchema";
import { FieldType } from "../components/blocks/inputs/InputField";
import { maitreApprentissageSchema } from "../components/blocks/maitreApprentissage/maitreApprentissageSchema";

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
  mask?: string;
  maskBlocks?: {
    name?: string;
    mask?: string;
    pattern?: string;
  }[];
  options?: SelectOptions;
}

interface CerfaFields {
  [key: string]: CerfaField;
}

interface CerfaSchema {
  fields: CerfaFields;
}

const cerfaSchema: CerfaSchema = {
  fields: {
    ...(employeurSchema as const),
    ...maitreApprentissageSchema,
    ...apprentiSchema,
    ...contratSchema,
    ...formationSchema,
  },
  // logics: controls,
};

export default cerfaSchema;
