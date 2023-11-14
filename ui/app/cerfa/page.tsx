import { Container, Typography } from "@mui/material";
import { FC } from "react";

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
        <CerfaForm />
      </Container>
    </>
  );
};

export default CerfaPage;
