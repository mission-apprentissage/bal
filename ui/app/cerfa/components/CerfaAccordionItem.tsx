import Accordion, { AccordionProps } from "@codegouvfr/react-dsfr/Accordion";
import { FC, PropsWithChildren } from "react";

interface Props extends AccordionProps.Controlled {
  completion: number;
}

const CerfaAccordionItem: FC<PropsWithChildren<Props>> = ({ label, completion, children, ...props }) => {
  return (
    <Accordion {...props} label={`${label} - ${completion}%`}>
      {children}
    </Accordion>
  );
};

export default CerfaAccordionItem;
