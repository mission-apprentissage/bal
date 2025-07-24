import type { ToggleSwitchProps } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import type { ControllerProps, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

interface Props<T extends FieldValues> extends Omit<ControllerProps<T>, "render"> {
  toggleSwitchProps: ToggleSwitchProps;
}

const ToggleSwitchInput = <T extends FieldValues>({ toggleSwitchProps, ...props }: Props<T>) => {
  return (
    <Controller<T>
      {...props}
      render={({ field }) => {
        return (
          <ToggleSwitch
            {...toggleSwitchProps}
            checked={field.value}
            onChange={(value) => {
              return field.onChange(value);
            }}
          />
        );
      }}
    />
  );
};

export default ToggleSwitchInput;
