import Notice from "@codegouvfr/react-dsfr/Notice";

import { StyledNoticeContainer } from "./MobileNotice.styled";

const MobileNotice = () => {
  return (
    <StyledNoticeContainer>
      <Notice title="Pour une expérience optimale, nous vous recommandons de passer sur ordinateur pour profiter d'une navigation plus fluide." />
    </StyledNoticeContainer>
  );
};

export default MobileNotice;
