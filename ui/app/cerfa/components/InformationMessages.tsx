import { fr } from "@codegouvfr/react-dsfr";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { useRecoilState } from "recoil";

import Markdown from "../../components/Markdown";
import { informationMessagesState } from "../atoms/informationMessages.atom";
import { InformationMessage } from "../utils/cerfaSchema";

interface Props {
  messages: InformationMessage[] | undefined;
}

const SETTINGS = {
  assistive: { title: "Le saviez-vous ?", color: fr.colors.decisions.background.contrast.info.default },
  regulatory: { title: "Info légale", color: fr.colors.decisions.background.contrast.warning.default },
  bonus: { title: "Bonus", color: fr.colors.decisions.background.contrast.yellowMoutarde.default },
};

const InformationMessages: FC<Props> = () => {
  const [messages] = useRecoilState(informationMessagesState);

  return (
    <Box p={2} pt={0} position="sticky" top={24}>
      {messages?.map((message) => {
        const { type, content } = message;
        const { color, title } = SETTINGS[type];

        return (
          <Box key={type} bgcolor={color} borderRadius="4px" p={2} mb={2}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Markdown>{content}</Markdown>
          </Box>
        );
      })}
    </Box>
  );
};

export default InformationMessages;
