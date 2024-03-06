import { fr } from "@codegouvfr/react-dsfr";
import Accordion, { AccordionProps } from "@codegouvfr/react-dsfr/Accordion";
import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface Props extends AccordionProps.Controlled {
  completion: number;
}

const CerfaAccordionItem: FC<PropsWithChildren<Props>> = ({ label, completion, children, ...props }) => {
  return (
    <Accordion
      {...props}
      label={
        <>
          <Box
            component="i"
            mr={2}
            color={
              completion === 100
                ? fr.colors.decisions.text.default.success.default
                : fr.colors.decisions.background.flat.warning.default
            }
            className={fr.cx(completion === 100 ? "fr-icon-checkbox-circle-fill" : "fr-icon-edit-fill")}
          />
          {`${label}`}
        </>
      }
    >
      {children}
    </Accordion>
  );
};

export default CerfaAccordionItem;
