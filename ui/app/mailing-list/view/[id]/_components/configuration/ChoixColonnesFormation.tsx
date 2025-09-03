import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Box, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import { fr } from "@codegouvfr/react-dsfr";
import { ChoixColonnesFormationRow } from "./ChoixColonnesFormationRow";
import { useMailingListConfigMutation } from "@/app/mailing-list/view/[id]/_hooks/useMailingListConfigMutation";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  mailingList: IMailingListV2Json;
  readonly: boolean;
}

type ITrainingColumnForm = {
  cle_ministere_educatif: string;
  cfd: string;
  rncp: string;
  mef: string;
  uai_lieu_formation: string;
  uai_formateur: string;
  uai_formateur_responsable: string;
  code_postal: string;
  code_insee: string;
};

export interface ITrainingField {
  name: keyof ITrainingColumnForm;
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

export function ChoixColonnesFormation({ mailingList, onNext, onPrev, readonly }: Props) {
  const form = useForm<ITrainingColumnForm>({
    defaultValues: {
      cle_ministere_educatif: mailingList?.config.lba_columns?.cle_ministere_educatif ?? "",
      cfd: mailingList?.config.lba_columns?.cfd ?? "",
      rncp: mailingList?.config.lba_columns?.rncp ?? "",
      mef: mailingList?.config.lba_columns?.mef ?? "",
      uai_lieu_formation: mailingList?.config.lba_columns?.uai_lieu_formation ?? "",
      uai_formateur: mailingList?.config.lba_columns?.uai_formateur ?? "",
      uai_formateur_responsable: mailingList?.config.lba_columns?.uai_formateur_responsable ?? "",
      code_postal: mailingList?.config.lba_columns?.code_postal ?? "",
      code_insee: mailingList?.config.lba_columns?.code_insee ?? "",
    },
    disabled: readonly,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync, isError: isMutationError, error: mutationError } = useMailingListConfigMutation();

  const onSubmit = async (data: ITrainingColumnForm) => {
    await mutateAsync({
      params: { id: mailingList._id },
      body: {
        lba_columns: {
          cle_ministere_educatif: data.cle_ministere_educatif,
          cfd: data.cfd,
          rncp: data.rncp,
          mef: data.mef,
          uai_lieu_formation: data.uai_lieu_formation,
          uai_formateur: data.uai_formateur,
          uai_formateur_responsable: data.uai_formateur_responsable,
          code_postal: data.code_postal,
          code_insee: data.code_insee,
        },
      },
    });

    onNext();
  };

  if (!mailingList.config.output_columns.some((c) => c.input.type === "computed" && c.input.name === "WEBHOOK_LBA")) {
    return (
      <Box sx={{ display: "grid", gap: fr.spacing("4w") }}>
        <Alert
          title="Cette étape est facultative"
          description="Vous n'avez pas sélectionné le champs WEBHOOK_LBA."
          severity="info"
        />
        <Box sx={{ display: "flex", gap: fr.spacing("4w"), justifyContent: "flex-end" }}>
          <Button type="button" priority="tertiary" onClick={onPrev}>
            Retour
          </Button>
          <Button type="button" onClick={onNext}>
            Continuer
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
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
            <ChoixColonnesFormationRow key={field.name} field={field} mailingList={mailingList} />
          ))}
          <Box sx={{ display: "grid", gap: fr.spacing("4w") }}>
            {isMutationError && (
              <Box color="error" my={2}>
                <Alert
                  title=" Une erreur est survenue lors de la configuration"
                  description={mutationError.message}
                  severity="error"
                />
              </Box>
            )}
            <Box sx={{ display: "flex", gap: fr.spacing("4w"), justifyContent: "flex-end" }}>
              <Button type="button" priority="tertiary" disabled={isSubmitting} onClick={onPrev}>
                Retour
              </Button>
              {!readonly && (
                <Button type="submit" disabled={isSubmitting}>
                  Continuer
                </Button>
              )}
              {readonly && (
                <Button type="button" onClick={onNext}>
                  Continuer
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
