import { Collapse } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  show: ({ values }: { values: any }) => boolean;
}

const CollapseController: FC<PropsWithChildren<Props>> = ({ show, children }) => {
  const { getValues } = useFormContext();
  const values = getValues();

  return <Collapse in={show({ values })}>{children}</Collapse>;
};

export default CollapseController;
