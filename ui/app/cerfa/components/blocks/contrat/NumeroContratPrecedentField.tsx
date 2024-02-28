import { shouldAskNumeroContratPrecedent } from "shared/helpers/cerfa/domains/contrat/shouldAskContratPrecedent";

import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";

const NumeroContratPrecedentField = () => {
  // const { watch, getFieldState } = useFormContext();
  // const numeroContratPrecedentField = getFieldState("contrat.numeroContratPrecedent");
  // const numeroContratPrecedent = watch("contrat.numeroContratPrecedent");

  // const contratPrecedentDetails = useMemo(
  //   () => ({
  //     departement: numeroContratPrecedent?.substr(0, 3),
  //     annee: numeroContratPrecedent?.substr(3, 4),
  //     mois: numeroContratPrecedent?.substr(7, 2),
  //     Nc: numeroContratPrecedent?.substr(9, 2),
  //   }),
  //   [numeroContratPrecedent]
  // );

  return (
    <>
      <CollapseController show={shouldAskNumeroContratPrecedent}>
        <InputController name="contrat.numeroContratPrecedent" />
      </CollapseController>
      {/* {numeroContratPrecedent !== "" &&
        numeroContratPrecedentField.isTouched &&
        !numeroContratPrecedentField.invalid && (
          <Typography>
            Information sur le précedent contrat:
            <br /> {contratPrecedentDetails.mois}/{contratPrecedentDetails.annee}
            {", "}
            {departements[contratPrecedentDetails.departement]?.name} ({contratPrecedentDetails.departement})
            {contratPrecedentDetails.Nc === "NC" && ", non conforme."}
          </Typography>
        )} */}
    </>
  );
};

export default NumeroContratPrecedentField;
