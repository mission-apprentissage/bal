import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const StyledNoticeContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  ${fr.breakpoints.up("md")} {
    display: none;
  }
`;
