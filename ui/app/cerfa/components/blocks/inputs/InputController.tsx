import { FC } from "react";
import { useFormContext } from "react-hook-form";

import cerfaSchema, { indexedRules } from "../../../utils/cerfaSchema";
import InputField from "./InputField";

interface Props {
  name: string;
}

const InputController: FC<Props> = ({ name }) => {
  const fieldMethods = useFormContext();
  const fieldSchema = cerfaSchema.fields[name];
  const controls = indexedRules[name];

  return (
    <InputField
      name={name}
      fieldType={fieldSchema?.fieldType ?? "text"}
      fieldSchema={fieldSchema}
      fieldMethods={fieldMethods}
      controls={controls}
    />
  );
};

export default InputController;
