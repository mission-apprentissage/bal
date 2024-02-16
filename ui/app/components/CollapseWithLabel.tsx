import { fr } from "@codegouvfr/react-dsfr";
import { Box, Collapse, Typography } from "@mui/material";
import { FC, PropsWithChildren, useState } from "react";

interface Props {
  label: string;
}

const CollapseWithLabel: FC<PropsWithChildren<Props>> = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box display="flex" mb={1}>
        <Typography
          gutterBottom
          color={fr.colors.decisions.text.actionHigh.blueFrance.default}
          sx={{
            cursor: "pointer",
            borderBottom: `1px solid ${fr.colors.decisions.text.actionHigh.blueFrance.default}`,
          }}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          {label}
          <Box component="i" ml={1} className={fr.cx(open ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
        </Typography>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
};

export default CollapseWithLabel;
