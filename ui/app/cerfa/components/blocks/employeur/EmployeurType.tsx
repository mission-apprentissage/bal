import Alert from "@codegouvfr/react-dsfr/Alert";
import { getLink } from "@codegouvfr/react-dsfr/link";
import { Box } from "@mui/material";

import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import { shouldShowEmployeurTypeInformation } from "./domain/shouldShowEmployeurTypeInformation";

const { Link } = getLink();

const EmployeurType = () => {
  return (
    <>
      <InputController name="employeur.privePublic" />

      <CollapseController show={shouldShowEmployeurTypeInformation}>
        <Box mb={2}>
          <Alert
            severity="warning"
            title="Ce formulaire est reservé aux contrats des employeurs privés"
            description={
              <>
                Rendez-vous sur Celia <Link href="https://celia.emploi.gouv.fr/">https://celia.emploi.gouv.fr/</Link>{" "}
                pour transmettre le contrat d'un employeur public. Si vous représentez une Société d'économie mixte ou
                un EPIC (établissement public à caractère industriel et commercial), vous pouvez continuer la saisie.
              </>
            }
          />
        </Box>
      </CollapseController>
    </>
  );
};

export default EmployeurType;
