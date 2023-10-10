import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const ConsentInput: FC<InputFieldProps> = (props) => {
  const { name, fieldMethods, fieldSchema } = props;

  return (
    <Checkbox
      // legend=
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
      // state="default"
      // stateRelatedMessage="State description"
    />
  );
};

export default ConsentInput;
