import { apprentiSchema } from "./apprentiSchema";
import { contratSchema } from "./contratSchema";
import { employeurSchema } from "./employeurSchema";
import { formationSchema } from "./formationSchema";
import { maitreApprentissageSchema } from "./maitreApprentissageSchema";
import { signaturesSchema } from "./signaturesSchema";

const cerfaSchema = {
  ...employeurSchema,
  ...apprentiSchema,
  ...maitreApprentissageSchema,
  ...contratSchema,
  ...formationSchema,
  ...signaturesSchema,
};

export default cerfaSchema;
