"use client";
import { Container, Typography } from "@mui/material";
import { FC } from "react";
import { RecoilRoot } from "recoil";

import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import CerfaForm from "./components/CerfaForm";

const CerfaPage: FC = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Breadcrumb pages={[PAGES.nouveauDossier()]} />
        <Typography variant="h2" gutterBottom>
          Contrat
        </Typography>
      </Container>
      <RecoilRoot>
        <CerfaForm />
      </RecoilRoot>
    </>
  );
};

export default CerfaPage;
