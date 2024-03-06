import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";
import Image from "next/image";

export const StyledAttributes = styled.section`
  display: flex;
  background-color: ${fr.colors.decisions.background.default.grey.default};
  border-radius: 8px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 18, 0.16);
  padding: ${fr.spacing("6w")};
  margin-bottom: ${fr.spacing("6w")};
`;

export const StyledAttributeImage = styled(Image)`
  margin-bottom: ${fr.spacing("3w")};
`;
