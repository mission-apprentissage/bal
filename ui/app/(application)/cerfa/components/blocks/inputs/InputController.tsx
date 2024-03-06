import { FC } from "react";
import { useFormContext } from "react-hook-form";

import { getFieldSchema } from "../../../utils/cerfaSchema";
import InputField from "./InputField";

interface Props {
  name: string;
}

const InputController: FC<Props> = ({ name }) => {
  const fieldMethods = useFormContext();
  const fieldSchema = getFieldSchema(name);

  const values = fieldMethods.watch();

  const computedFieldSchema = { ...fieldSchema, ...fieldSchema?._init?.({ values }) };

  return (
    <InputField
      name={name}
      fieldType={fieldSchema?.fieldType ?? "text"}
      fieldSchema={computedFieldSchema}
      fieldMethods={fieldMethods}
    />
  );
};

export default InputController;
