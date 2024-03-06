import { Box } from "@mui/material";
import { FC } from "react";
import { useRecoilState } from "recoil";

import InformationMessages from "../../components/InformationMessages";
import { activeFieldState, fieldsState } from "../atoms/fields.atom";
import { informationMessagesState } from "../atoms/informationMessages.atom";

const CerfaInformationMessages: FC = () => {
  const [messages = []] = useRecoilState(informationMessagesState);
  const [activeField] = useRecoilState(activeFieldState);
  const [fields] = useRecoilState(fieldsState);

  const activeFieldMessages = fields[activeField]?.informationMessages ?? [];
  const allMessages = [...activeFieldMessages, ...messages];
  return (
    <Box p={2} pt={0} position="sticky" top={24}>
      <InformationMessages messages={allMessages} />
    </Box>
  );
};

export default CerfaInformationMessages;
