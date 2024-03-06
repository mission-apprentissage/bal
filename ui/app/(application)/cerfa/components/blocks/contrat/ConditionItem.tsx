import { fr } from "@codegouvfr/react-dsfr";
import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface Props {
  state: "success" | "error";
}

const ConditionItem: FC<PropsWithChildren<Props>> = ({ children, state }) => {
  return (
    <Box sx={{ color: fr.colors.decisions.text.default[state].default }} mb={1}>
      {state === "success" && <i className={fr.cx("fr-icon-checkbox-circle-line")} />}
      {state === "error" && <i className={fr.cx("fr-icon-close-line")} />}
      {children}
    </Box>
  );
};

export default ConditionItem;
