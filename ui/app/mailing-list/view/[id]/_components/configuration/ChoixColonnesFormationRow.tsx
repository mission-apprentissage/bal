import { fr } from "@codegouvfr/react-dsfr";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TooltipProps } from "@mui/material/Tooltip";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useFormContext } from "react-hook-form";
import type { IMailingListV2Json } from "shared/models/mailingListV2.model";
import type { ITrainingField } from "./ChoixColonnesFormation";
import MailingListSectionRow from "@/app/liste-diffusion/nouvelle-liste/components/MailingListSectionRow";
import MailingListSectionCell from "@/app/liste-diffusion/nouvelle-liste/components/MailingListSectionCell";
import { useMailingListSample } from "@/app/mailing-list/view/[id]/_hooks/useMailingListSample";
import Sample from "@/app/liste-diffusion/nouvelle-liste/components/Sample";

interface Props {
  field: ITrainingField;
  mailingList: IMailingListV2Json;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: fr.colors.decisions.background.default.grey.default,
    color: fr.colors.decisions.text.default.grey.default,
  },
}));

export function ChoixColonnesFormationRow({ field, mailingList }: Props) {
  const {
    formState: { errors },
    register,
    watch,
    // TODO: Fix types
  } = useFormContext<{
    cle_ministere_educatif: string;
    cfd: string;
    rncp: string;
    mef: string;
    uai_lieu_formation: string;
    uai_formateur: string;
    uai_formateur_responsable: string;
    code_postal: string;
    code_insee: string;
  }>();

  const value = watch(field.name);
  const sampleResult = useMailingListSample(mailingList._id);

  return (
    <MailingListSectionRow>
      <MailingListSectionCell>
        {field.label}
        {field.tooltip && (
          <LightTooltip
            title={
              <>
                <Typography fontSize={12} gutterBottom>
                  <strong>{field.tooltip?.title}</strong>
                </Typography>
                <Typography fontSize={12}>{field.tooltip?.description}</Typography>
              </>
            }
          >
            <Box component="i" ml={1} className="ri-information-line" />
          </LightTooltip>
        )}
      </MailingListSectionCell>
      <MailingListSectionCell>
        <Select
          label=""
          state={errors[field.name] ? "error" : "default"}
          stateRelatedMessage={errors[field.name]?.message}
          nativeSelectProps={{
            ...register(field.name),
          }}
        >
          <option value="">Choisir la colonne source</option>
          {mailingList.source.columns.map((column) => (
            <option key={column}>{column}</option>
          ))}
        </Select>
      </MailingListSectionCell>
      <MailingListSectionCell>
        <Sample sample={sampleResult.data ?? []} column={value} isLoading={sampleResult.isLoading} />
      </MailingListSectionCell>
    </MailingListSectionRow>
  );
}
