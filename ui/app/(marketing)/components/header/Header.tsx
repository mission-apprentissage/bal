"use client";

import { Badge } from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { Typography } from "@mui/material";
import { FC } from "react";

import { PAGES } from "../../../(application)/components/breadcrumb/Breadcrumb";
import { StyledHeader, StyledHeaderTitleContainer } from "./Header.styled";

const Header: FC = () => {
  return (
    <StyledHeader>
      <Badge severity="new" noIcon>
        Vous êtes un employeur privé ?
      </Badge>
      <StyledHeaderTitleContainer>
        <Typography variant="h1">
          Optimisez la création de vos contrats d’apprentissage :<br /> simple, rapide et sans erreur !
        </Typography>
      </StyledHeaderTitleContainer>
      <Button
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
        linkProps={{
          href: PAGES.cerfa().path,
        }}
      >
        Commencer
      </Button>
    </StyledHeader>
  );
};

export default Header;
