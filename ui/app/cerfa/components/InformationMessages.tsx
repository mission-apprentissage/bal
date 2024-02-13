import { fr } from "@codegouvfr/react-dsfr";
import { Box, Grow, Typography } from "@mui/material";
import { FC } from "react";
import { useRecoilState } from "recoil";

import { BonusAvatar } from "../../../icons/BonusAvatar";
import { InformationAvatar } from "../../../icons/InformationAvatar";
import { RegulatoryAvatar } from "../../../icons/RegulatoryAvatar";
import Markdown from "../../components/Markdown";
import { activeFieldState, fieldsState } from "../atoms/fields.atom";
import { informationMessagesState } from "../atoms/informationMessages.atom";

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

const InformationMessages: FC = () => {
  const [messages = []] = useRecoilState(informationMessagesState);
  const [activeField] = useRecoilState(activeFieldState);
  const [fields] = useRecoilState(fieldsState);

  const activeFieldMessages = fields[activeField]?.informationMessages ?? [];

  return (
    <Box p={2} pt={0} position="sticky" top={24}>
      {[...activeFieldMessages, ...messages]?.map((message) => {
        const { type, content } = message;
        const { backgroundColor, title, icon } = SETTINGS[type];

        return (
          <Grow in key={`${type}-${content?.slice(0, 10)}`}>
            <Box bgcolor={backgroundColor} borderRadius="4px" p={2} mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box mr={2}>{icon}</Box>
                <Typography variant="h6" gutterBottom color={title.color}>
                  {title.content}
                </Typography>
              </Box>
              <Markdown>{content}</Markdown>
            </Box>
          </Grow>
        );
      })}
    </Box>
  );
};

export default InformationMessages;
