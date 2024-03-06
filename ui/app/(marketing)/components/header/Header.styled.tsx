import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

import stars from "./stars_bg.png";

export const StyledHeader = styled.header`
  height: 604px;
  margin: ${fr.spacing("3w")};
  margin-top: ${fr.spacing("4w")};
  border-radius: 8px;
  opacity: 0.8;

  background:
    url(${stars.src}) no-repeat center,
    linear-gradient(
      282deg,
      #fceeac 0%,
      #ffe4b9 9.5%,
      #ffdfcd 21.5%,
      #ffdee1 27.5%,
      #ffe1ee 38%,
      #fde3f4 46%,
      #fbe6fa 55%,
      #f8e9ff 63.5%,
      #f3eaff 72%,
      #efebff 82%,
      #ebecff 91.5%,
      #efebff 100%
    );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledHeaderTitleContainer = styled(Box)`
  max-width: 653px;
  text-align: center;
  margin-top: ${fr.spacing("3w")};
  margin-bottom: ${fr.spacing("3w")};
  color: ${fr.colors.decisions.background.default.grey.default};
`;
