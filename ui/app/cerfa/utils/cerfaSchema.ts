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
  fields: {
    ...employeurSchema,
    ...maitreApprentissageSchema,
    ...apprentiSchema,
    ...contratSchema,
    ...formationSchema,
  },
  logics: controls,
};

export default cerfaSchema;
