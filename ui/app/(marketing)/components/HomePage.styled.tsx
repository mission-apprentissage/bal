import styled from "@emotion/styled";
import { Container } from "@mui/material";

import stars from "./stars_bg.png";

export const StyledSectionsContainer = styled(Container)`
  position: relative;
  top: -165px;
  background: url(${stars.src}) no-repeat center;
`;
