import Notice from "@codegouvfr/react-dsfr/Notice";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { idcc, isIdccEnVigueur } from "shared/constants/idcc";
import { shouldShowSmc } from "shared/helpers/cerfa/domains/contrat/shouldShowSmc";

import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";

const SmcField: FC = () => {
  const {
    employeur: { codeIdcc },
  } = useFormContext().getValues();

  let idccIsInVigueur = true;

  const foundIdcc = idcc?.[codeIdcc?.padStart(4, "0")];

  if (foundIdcc) {
    idccIsInVigueur = isIdccEnVigueur(foundIdcc);
  }

  return (
    <CollapseController show={shouldShowSmc}>
      <InputController name="contrat.smc" />

      {foundIdcc?.url && !idccIsInVigueur && (
        <Notice title="La convention collective indiquée dans la partie « Employeur » n’est plus applicable (abrogée, dénoncée, périmée ou remplacée)." />
      )}
    </CollapseController>
  );
};

export default SmcField;
