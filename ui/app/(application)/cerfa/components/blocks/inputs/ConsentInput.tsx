import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const ConsentInput: FC<InputFieldProps> = ({ fieldSchema, state, stateRelatedMessage, inputProps }) => {
  return (
    <Checkbox
      options={[
        {
          label: fieldSchema?.label ?? "",
          nativeInputProps: inputProps,
        },
      ]}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={inputProps.disabled}
    />
  );
};

export default ConsentInput;
