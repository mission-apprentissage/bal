import { getLink } from "@codegouvfr/react-dsfr/link";
import { Box, Typography } from "@mui/material";
import { shouldShowEmployeurTypeInformation } from "shared/helpers/cerfa/domains/employeur/shouldShowEmployeurTypeInformation";

import InformationMessage from "../../../../components/InformationMessage";
import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";

const { Link } = getLink();

const EmployeurType = () => {
  return (
    <>
      <InputController name="employeur.privePublic" />

      <CollapseController show={shouldShowEmployeurTypeInformation}>
        <Box mb={2}>
          <InformationMessage type="assistive">
            <>
              <Typography variant="h6" gutterBottom>
                Ce formulaire est reservé aux contrats des employeurs privés
              </Typography>
              <Typography gutterBottom>
                Rendez-vous sur Celia <Link href="https://celia.emploi.gouv.fr/">https://celia.emploi.gouv.fr/</Link>{" "}
                pour transmettre le contrat d'un employeur public.
              </Typography>
              <Typography>
                Si vous représentez une Société d'économie mixte ou un EPIC (établissement public à caractère industriel
                et commercial), vous pouvez continuer la saisie.
              </Typography>
            </>
          </InformationMessage>
        </Box>
      </CollapseController>
    </>
  );
};

export default EmployeurType;
