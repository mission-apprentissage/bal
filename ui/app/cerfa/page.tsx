"use client";
import { Container, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { RecoilRoot } from "recoil";

import Breadcrumb, { PAGES } from "../components/breadcrumb/Breadcrumb";
import CerfaForm from "./components/CerfaForm";

const CerfaPage: FC = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Breadcrumb pages={[PAGES.nouveauDossier()]} />
      </Container>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={3} />
        <Grid item xs={9}>
          <Typography variant="h1" gutterBottom>
            Cerfa 10103*10
          </Typography>
        </Grid>
      </Grid>
      <RecoilRoot>
        <CerfaForm />
      </RecoilRoot>
    </>
  );
};

export default CerfaPage;
