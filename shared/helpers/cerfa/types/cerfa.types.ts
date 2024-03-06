import { CerfaControl } from "../../../../ui/app/(application)/cerfa/controls";

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

export interface SelectOption {
  label: string;
  value: string;
  locked?: boolean;
}

export interface SelectNestedOption {
  name: string;
  options: SelectOption[];
}

export interface RadioOption {
  label: string;
  value: string | number;
}

export type SelectOptions = SelectOption[] | SelectNestedOption[] | RadioOption[];

export interface InformationMessage {
  type: "assistive" | "regulatory" | "bonus";
  title?: string;
  icon?: string;
  content: string;
  collapse?: {
    label: string;
    content: string;
  };
}

export interface CerfaField {
  _init?: ({ values }: { values: any }) => CerfaField;
  required?: boolean;
  showInfo?: boolean;
  fieldType?: FieldType;
  label?: string;
  placeholder?: string;
  requiredMessage?: string;
  validateMessage?: string;
  locked?: boolean;
  completion?: boolean;
  precision?: number;
  min?: number;
  max?: number;
  showsOverlay?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  mask?: string;
  definitions?: Record<string, string | RegExp>;
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
  maskLazy?: boolean;
  minLength?: number;
  maxLength?: number;
  options?: SelectOptions;
  messages?: InformationMessage[];
}

export type CerfaFields = Record<string, CerfaField>;

export interface CerfaSchema {
  fields: CerfaFields;
  logics: CerfaControl[];
}

export interface CerfaForm {
  values: any;
  dossier?: any;
  signal?: any;
  cache?: any;
  fields?: any;
}
