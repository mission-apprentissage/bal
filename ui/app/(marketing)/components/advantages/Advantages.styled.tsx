import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";
import Image from "next/image";

export const StyledImageForm = styled(Image)`
  margin-top: ${fr.spacing("2w")};
  padding: ${fr.spacing("1w")};
  background-color: #fef4f2;
  object-fit: "contain";
`;

export const StyledAdvantageContainer = styled.div`
  display: flex;
  margin-bottom: ${fr.spacing("6w")};
`;

export const StyledAdvantageImage = styled(Image)`
  margin-right: ${fr.spacing("3w")};
`;

export const StyledCallToActionContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${fr.spacing("6w")};
`;
