import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const ConsentInput: FC<InputFieldProps> = ({ name, fieldMethods, fieldSchema, state, stateRelatedMessage }) => {
  return (
    <Checkbox
      options={[
        {
          label: fieldSchema?.label ?? "",
          nativeInputProps: {
            name: name,
            onChange: (event) => {
              fieldMethods.setValue(name, event.target.checked);
            },
          },
        },
      ]}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  );
};

export default ConsentInput;
