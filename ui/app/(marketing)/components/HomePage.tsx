"use client";

import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";

import Advantages from "./advantages/Advantages";
import Attributes from "./attributes/Attributes";
import Header from "./header/Header";
import { StyledSectionsContainer } from "./HomePage.styled";
import Statistics from "./statistics/Statistics";

const HomePage = () => {
  return (
    <MuiDsfrThemeProvider>
      <main>
        <Header />
        <StyledSectionsContainer maxWidth="xl">
          <Attributes />
          <Statistics />
          <Advantages />
        </StyledSectionsContainer>
      </main>
    </MuiDsfrThemeProvider>
  );
};

export default HomePage;
