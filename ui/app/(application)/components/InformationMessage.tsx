import { fr } from "@codegouvfr/react-dsfr";
import { Box, Grow, Typography } from "@mui/material";
import { BonusAvatar } from "icons/BonusAvatar";
import { InformationAvatar } from "icons/InformationAvatar";
import { RegulatoryAvatar } from "icons/RegulatoryAvatar";
import Image from "next/image";
import { FC, PropsWithChildren, ReactNode } from "react";

import CollapseWithLabel from "./CollapseWithLabel";

interface Props {
  type: "assistive" | "regulatory" | "bonus";
  collapse?: { label: string; content: ReactNode };
  title?: string;
  icon?: ReactNode;
}

const SETTINGS = {
  assistive: {
    backgroundColor: fr.colors.decisions.background.contrast.info.default,
    title: { content: "Information", color: fr.colors.decisions.background.flat.info.default },
    icon: <InformationAvatar />,
  },

  regulatory: {
    backgroundColor: fr.colors.decisions.background.contrast.greenTilleulVerveine.default,
    title: { content: "Réglementation", color: fr.colors.decisions.background.flat.greenTilleulVerveine.default },
    icon: <RegulatoryAvatar />,
  },
  bonus: {
    backgroundColor: fr.colors.decisions.background.contrast.purpleGlycine.default,
    title: { content: "Le saviez-vous ?", color: fr.colors.decisions.background.flat.purpleGlycine.default },
    icon: <BonusAvatar />,
  },
};

const InformationMessage: FC<PropsWithChildren<Props>> = ({ type, collapse, title, icon, children }) => {
  const { backgroundColor, title: defaultTitle, icon: defaultIcon } = SETTINGS[type];

  let image: ReactNode = defaultIcon;

  if (icon) {
    if (typeof icon === "string") {
      image = (
        <Image width={50} height={50} src={icon} alt={title ?? defaultTitle.content} style={{ borderRadius: "50%" }} />
      );
    } else {
      image = icon;
    }
  }
  return (
    <Grow in>
      <Box bgcolor={backgroundColor} borderRadius="4px" p={2} mb={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Box mr={2}>{image}</Box>
          <Typography variant="h6" gutterBottom color={defaultTitle.color}>
            {title ?? defaultTitle.content}
          </Typography>
        </Box>
        {children}
        {collapse && (
          <Box mt={2}>
            <CollapseWithLabel label={collapse.label}>{collapse.content}</CollapseWithLabel>
          </Box>
        )}
      </Box>
    </Grow>
  );
};

export default InformationMessage;
