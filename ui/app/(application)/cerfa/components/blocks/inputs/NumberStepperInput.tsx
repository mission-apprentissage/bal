import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Box } from "@mui/material";
import { FC } from "react";

import { InputFieldProps } from "./InputField";

const NumberStepperInput: FC<InputFieldProps> = ({
  name,
  fieldSchema,
  fieldMethods,
  inputProps,
  state,
  stateRelatedMessage,
}) => {
  const increment = () => {
    fieldMethods.setValue(name, Number(fieldMethods.getValues(name)) + 1, { shouldValidate: true });
  };

  const decrement = () => {
    fieldMethods.setValue(name, Number(fieldMethods.getValues(name)) - 1, { shouldValidate: true });
  };

  return (
    <Box display="flex">
      <Input
        label={fieldSchema.label}
        nativeInputProps={{
          ...inputProps,
          inputMode: "numeric",
          pattern: "[0-9]*",
          type: "number",
          placeholder: fieldSchema.placeholder,
        }}
        state={state}
        stateRelatedMessage={stateRelatedMessage}
        disabled={inputProps.disabled}
      />
      <Box minWidth={40} mx={2} mt={4}>
        <Button style={{ minWidth: 40 }} type="button" onClick={decrement} priority="secondary" title="Décrementer">
          -
        </Button>
      </Box>
      <Box minWidth={40} mr={2} mt={4}>
        <Button type="button" onClick={increment} priority="secondary" title="Incrémenter">
          +
        </Button>
      </Box>
    </Box>
  );
};

export default NumberStepperInput;
