import { fr } from "@codegouvfr/react-dsfr";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TooltipProps } from "@mui/material/Tooltip";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { IDocumentContentJson } from "shared/models/documentContent.model";
import type { IMailingListJson } from "shared/models/mailingList.model";

import type { ITrainingField } from "./ChoixColonnesFormation";
import MailingListSectionCell from "./MailingListSectionCell";
import MailingListSectionRow from "./MailingListSectionRow";
import Sample from "./Sample";

interface Props {
  columns: string[];
  sample: IDocumentContentJson[];
  field: ITrainingField;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: fr.colors.decisions.background.default.grey.default,
    color: fr.colors.decisions.text.default.grey.default,
  },
}));

const ChoixColonnesFormationRow: FC<Props> = ({ columns, sample, field }) => {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<IMailingListJson["training_columns"]>();

  const value = watch(field.name);

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
          <option value="">Choisir la colonne</option>
          {columns.map((column) => (
            <option key={column}>{column}</option>
          ))}
        </Select>
      </MailingListSectionCell>
      <MailingListSectionCell>
        <Sample sample={sample.map((c) => c.content)} column={value} />
      </MailingListSectionCell>
    </MailingListSectionRow>
  );
};

export default ChoixColonnesFormationRow;
