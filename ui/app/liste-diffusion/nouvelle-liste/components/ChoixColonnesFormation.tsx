import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IDocumentContentJson } from "shared/models/documentContent.model";
import { IMailingListJson } from "shared/models/mailingList.model";

import { IPostMailingListRoute } from "../page";
import ChoixColonnesFormationRow from "./ChoixColonnesFormationRow";

interface Props {
  onSuccess: (data: Pick<IPostMailingListRoute, "training_columns">) => void;
  columns: string[];
  sample: IDocumentContentJson[];
  onCancel: () => void;
  mailingList?: IMailingListJson;
}

type ITrainingColumnForm = IMailingListJson["training_columns"];

export interface ITrainingField {
  name:
    | "cle_ministere_educatif"
    | "mef"
    | "cfd"
    | "rncp"
    | "code_postal"
    | "uai_lieu_formation"
    | "uai_formateur"
    | "uai_formateur_responsable"
    | "code_insee";
  label: string;
  tooltip?: {
    title: string;
    description: string;
  };
}

const fields: ITrainingField[] = [
  {
    name: "cle_ministere_educatif",
    label: "Clé ME",
    tooltip: {
      title: "Clé à l’usage des ministères éducatifs (Parcoursup / Affelnet).",
      description:
        "Permet de désigner une formation avec tous ses attributs (année de démarrage, durée de la formation, année du cycle concernée, établissements gestionnaire, formateur et lieu de formation).",
    },
  },
  {
    name: "cfd",
    label: "Code CFD",
    tooltip: {
      title: "Code Formation Diplôme",
      description:
        "Identifie une formation reconnue par l’Etat (Education Nationale). Sur 8 caractères, peut changer sur une formation donnée dans le cadre d’une évolution du programme des cours par exemple https://www.education.gouv.fr/file/Statistiques/formation_diplome.csv",
    },
  },
  {
    name: "rncp",
    label: "Code RNCP",
    tooltip: {
      title: "Répertoire national des certifications professionnelles",
      description:
        "Recense tous les diplômes reconnus en France et délivrés par l’État https://www.francecompetences.fr/recherche_certificationprofessionnelle/",
    },
  },
  {
    name: "mef",
    label: "Code MEF",
    tooltip: {
      title: "Modules Élémentaires de Formation",
      description:
        "Ce code est composé de 10 à 11 caractères permet de décrire une année dans un dispositif de formation donné, comprenant le dispositif, la spécialité, le diplôme et l'année.",
    },
  },
  {
    name: "uai_lieu_formation",
    label: "Code UAI lieu de formation",
    tooltip: {
      title: "Unité Administrative Immatriculée",
      description:
        "Ce code est composé de 7 chiffres suivis d’une lettre, les trois premiers chiffres indiquant le département. https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/table/",
    },
  },
  {
    name: "uai_formateur",
    label: "Code UAI formateur",
    tooltip: {
      title: "Unité Administrative Immatriculée",
      description:
        "Ce code est composé de 7 chiffres suivis d’une lettre, les trois premiers chiffres indiquant le département. https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/table/",
    },
  },
  {
    name: "uai_formateur_responsable",
    label: "Code UAI gestionnaire",
    tooltip: {
      title: "Unité Administrative Immatriculée",
      description:
        "Ce code est composé de 7 chiffres suivis d’une lettre, les trois premiers chiffres indiquant le département. https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/table/",
    },
  },
  {
    name: "code_postal",
    label: "Code postal",
  },
  {
    name: "code_insee",
    label: "Code INSEE",
  },
];

const ChoixColonnesFormation: FC<Props> = ({ onSuccess, columns, onCancel, sample }) => {
  const form = useForm<ITrainingColumnForm>({
    defaultValues: {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ITrainingColumnForm) => {
    onSuccess({ training_columns: data });
  };

  return (
    <Box>
      {columns.length === 0 && (
        <Box my={2}>
          <Alert
            description="Il est nécessaire de sélectionner une source à l'étape 1 pour continuer."
            severity="info"
            title="Sélectionner une source"
          />
        </Box>
      )}
      <Typography mb={2}>
        Les champs liés à la formation nous permettent de générer les liens profonds vers La bonne alternance. En
        l'absence de la clé ME, les autres champs seront associés pour faire la correspondance entre les formations et
        les offres d'emploi.
      </Typography>
      <Typography>Veuillez renseigner au moins un des codes suivants : CFD, RNCP ou MEF</Typography>
      <Typography mb={4}>Veuillez renseigner au moins un des code UAI.</Typography>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field) => (
            <ChoixColonnesFormationRow key={field.name} sample={sample} columns={columns} field={field} />
          ))}
          <Box>
            <Box mx={2} display="inline-block">
              <Button type="button" priority="tertiary" disabled={isSubmitting} onClick={onCancel}>
                Retour
              </Button>
            </Box>
            <Button type="submit" disabled={isSubmitting}>
              Confirmer
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default ChoixColonnesFormation;
