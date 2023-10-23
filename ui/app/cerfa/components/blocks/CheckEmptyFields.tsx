import Button from "@codegouvfr/react-dsfr/Button";
import { FC } from "react";

interface Props {
  schema: any;
  blockName: string;
}

const CheckEmptyFields: FC<Props> = () => {
  return <Button type="submit">Est-ce que tous mes champs sont remplis ?</Button>;
};

export default CheckEmptyFields;
