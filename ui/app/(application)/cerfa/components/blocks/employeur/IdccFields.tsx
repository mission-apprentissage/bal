import { fr } from "@codegouvfr/react-dsfr";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { Box, Typography } from "@mui/material";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import { idcc } from "shared/constants/idcc";

import InputController from "../inputs/InputController";

const IdccFields = () => {
  const { getValues } = useFormContext();

  const idcss = (getValues("employeur.codeIdccs") as Array<string>)?.filter((i) => !["9998", "9999"].includes(i)) ?? [];

  const [_firstIdcc, ...suggestedIdcss] = idcss;
  const hasMultipleIdccs = suggestedIdcss && suggestedIdcss.length > 1;

  return (
    <>
      <InputController name="employeur.codeIdcc_special" />
      <InputController name="employeur.codeIdcc" />
      {hasMultipleIdccs && (
        <Box mb={3}>
          <Notice
            title={
              <>
                {suggestedIdcss.map((suggestedIdcc) => (
                  <Typography gutterBottom key={suggestedIdcc} className={fr.cx("fr-notice__title")}>
                    {`La convention collective ${suggestedIdcc}${
                      idcc[suggestedIdcc]?.libelle ? ` - ${idcc[suggestedIdcc]?.libelle}` : ""
                    } est aussi
                    applicable dans votre entreprise. Vous pouvez remplacer la donnée pré-remplie par cet IDCC selon le
                    poste qu’occupera l’apprenti(e).`}
                  </Typography>
                ))}
              </>
            }
          ></Notice>
        </Box>
      )}
      <InputController name="employeur.libelleIdcc" />
    </>
  );
};

export default IdccFields;
