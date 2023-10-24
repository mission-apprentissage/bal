import { Box, Typography } from "@mui/material";
import { FC } from "react";

import CheckEmptyFields from "../CheckEmptyFields";
import InputController from "../inputs/InputController";

const CerfaFormation: FC = () => {
  return (
    <Box>
      <Box>
        <InputController name="organismeFormation.formationInterne" type="radio" />
        <InputController name="organismeFormation.siret" />

        <Box>
          <Box mb={1}>
            <InputController name="organismeFormation.denomination" />
            <InputController name="organismeFormation.uaiCfa" />
            <Typography>Adresse du CFA responsable : </Typography>
            <Box>
              <InputController name="organismeFormation.adresse.numero" />
              <InputController name="organismeFormation.adresse.repetitionVoie" />
            </Box>
            <InputController name="organismeFormation.adresse.voie" />
            <InputController name="organismeFormation.adresse.complement" />
            <InputController name="organismeFormation.adresse.codePostal" />
            <InputController name="organismeFormation.adresse.commune" />
          </Box>
          <Box>
            <InputController name="formation.rncp" />
            <InputController name="formation.codeDiplome" />
            <InputController name="formation.typeDiplome" type="select" />
            <InputController name="formation.intituleQualification" />
            <Typography fontWeight={700} my={3}>
              Organisation de la formation en CFA :
            </Typography>
            <InputController name="formation.dateDebutFormation" type="date" />
            <InputController name="formation.dateFinFormation" type="date" />
            <Box mt={4}>
              <InputController name="formation.dureeFormation" type="number" />
              {/* <InputController name="formation.dureeFormation" type="number" precision={0} min={1} /> */}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography>Le lieu de formation :</Typography>
        <InputController name="etablissementFormation.memeResponsable" type="radio" />
        {/* <CollapseController show={shouldAskEtablissementFormation}> */}
        <InputController name="etablissementFormation.siret" />
        <Box>
          <Box>
            <InputController name="etablissementFormation.denomination" />
            <InputController name="etablissementFormation.uaiCfa" />
            <Typography fontWeight={700} my={3}>
              Adresse du lieu de formation :{" "}
            </Typography>
            <Box>
              <InputController name="etablissementFormation.adresse.numero" />
              {/* <InputController precision={0} name="etablissementFormation.adresse.numero" /> */}
              <InputController name="etablissementFormation.adresse.repetitionVoie" />
            </Box>
            <InputController name="etablissementFormation.adresse.voie" />
            <InputController name="etablissementFormation.adresse.complement" />
            <InputController name="etablissementFormation.adresse.codePostal" />
            <InputController name="etablissementFormation.adresse.commune" />
          </Box>
        </Box>
        {/* </CollapseController> */}
      </Box>
      <CheckEmptyFields schema={{}} blockName="formation" />
    </Box>
  );
};

export default CerfaFormation;
