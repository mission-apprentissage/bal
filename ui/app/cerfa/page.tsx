"use client";
import { Container } from "@mui/material";
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
      <RecoilRoot>
        <CerfaForm />
      </RecoilRoot>
    </>
  );
};

export default CerfaPage;
