import Notice from "@codegouvfr/react-dsfr/Notice";
import { Box } from "@mui/material";
import { useRecoilState } from "recoil";

import { fieldsState } from "../../../atoms/fields.atom";
import InputController from "../inputs/InputController";

const TypeEmployeurField = () => {
  const [fields] = useRecoilState(fieldsState);

  const { isAutocompleted } = fields?.["employeur.typeEmployeur"] ?? {};

  return (
    <>
      <InputController name="employeur.typeEmployeur" />
      {isAutocompleted && (
        <Box mb={3}>
          <Notice title="Veuillez vérifier et modifier si la suggestion vous semble incorrecte." />
        </Box>
      )}
    </>
  );
};

export default TypeEmployeurField;
