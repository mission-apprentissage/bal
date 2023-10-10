import { FC } from "react";
import { useFormContext } from "react-hook-form";

import cerfaSchema from "../../../utils/cerfaSchema";
import InputField, { FieldType } from "./InputField";

interface Props {
  name: string;
  fieldType?: FieldType;
  type?: string;
}

const InputController: FC<Props> = ({ name, fieldType }) => {
  const fieldMethods = useFormContext();
  const fieldSchema = cerfaSchema.fields[name];

  return (
    <InputField
      name={name}
      fieldSchema={fieldSchema}
      fieldType={fieldType ?? fieldSchema?.fieldType ?? "text"}
      fieldMethods={fieldMethods}
    />
  );
};

export default InputController;
