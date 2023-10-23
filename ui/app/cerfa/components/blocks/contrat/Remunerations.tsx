import Alert from "@codegouvfr/react-dsfr/Alert";
import { Box, Collapse, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useFormContext } from "react-hook-form";

import InputController from "../inputs/InputController";
import { shouldShowRemunerationsAnnuelles } from "./domain/shouldShowRemunerationsAnnuelles";

const getAnneeLabel = (ordre: 1.1 | 2.1 | 3.1 | 4.1) => {
  return {
    1.1: "1ère année d'exécution du contrat",
    2.1: "2ère année d'exécution du contrat",
    3.1: "3ère année d'exécution du contrat",
    4.1: "4ème année d'exécution du contrat",
  }[ordre];
};

export const Remunerations = () => {
  const { getValues } = useFormContext(); // retrieve those props
  const values = getValues();

  const dateDebutContrat = values.contrat.dateDebutContrat;
  const dateFinContrat = values.contrat.dateFinContrat;
  const apprentiDateNaissance = values.apprenti.dateNaissance;
  const employeurAdresseDepartement = values.employeur.adresse.departement;
  const smic = values.contrat.smic;
  const remunerationsAnnuelles = values.contrat.remunerationsAnnuelles;

  return (
    <Box padding={4}>
      <Typography>Rémunération</Typography>
      <Alert
        severity="info"
        small
        description={
          <>
            Le calcul de la rémunération est généré automatiquement à partir des informations <br />
            que vous avez remplies. <br />
            <strong>
              Le calcul indique la rémunération minimale légale, l&apos;employeur pouvant décider d&apos;attribuer
              <br /> une rémunération plus avantageuse.
            </strong>
          </>
        }
      />
      <Alert
        severity="info"
        small
        description={
          <>
            <Typography>
              <strong>Attention : Ne tient pas encore compte de situations spécifiques</strong>
              <br />
              Exemples : rémunération du contrat d&apos;apprentissage préparant à une licence professionnelle,
              majorations <br />
              En savoir plus sur les situations spécifiques sur le{" "}
              <Link href="https://travail-emploi.gouv.fr/formation-professionnelle/formation-en-alternance-10751/apprentissage/contrat-apprentissage#salaire">
                site du Ministère du Travail, de l&apos;Emploi et de l&apos;Insertion
              </Link>
            </Typography>
          </>
        }
      />

      {(dateDebutContrat === "" ||
        dateFinContrat === "" ||
        apprentiDateNaissance === "" ||
        employeurAdresseDepartement === "") && (
        <Box>
          <Typography>
            L&apos;outil détermine les périodes de rémunération et s&apos;assure du respect du minimum légale pour
            chacune des périodes, à partir des éléments renseignés.
          </Typography>
          <ul>
            <li color={apprentiDateNaissance === "" ? "error" : "green.500"}>
              La date de naissance de l&apos;apprenti
            </li>
            <li color={dateDebutContrat === "" ? "error" : "green.500"}>
              La date de début d&apos;exécution du contrat
            </li>
            <li color={dateFinContrat === "" ? "error" : "green.500"}>La date de fin du contrat</li>
            <li color={employeurAdresseDepartement === "" ? "error" : "green.500"}>
              Le département de l&apos;employeur
            </li>
          </ul>
        </Box>
      )}
      <Collapse in={shouldShowRemunerationsAnnuelles({ values })}>
        <Box>
          {remunerationsAnnuelles?.map((annee, i) => {
            const anneeLabel = getAnneeLabel(annee.ordre);
            return (
              <Box key={i} mt={anneeLabel ? 6 : 5}>
                {anneeLabel && (
                  <Box fontSize="1.1rem" fontWeight="bold" mb={1}>
                    {anneeLabel}
                  </Box>
                )}
                <Box key={i}>
                  <InputController name={`contrat.remunerationsAnnuelles[${i}].dateDebut`} />
                  <Box mt="1.7rem !important">au</Box>
                  <InputController name={`contrat.remunerationsAnnuelles[${i}].dateFin`} />
                  <InputController name={`contrat.remunerationsAnnuelles[${i}].taux`} />
                  <Box>
                    soit {annee.salaireBrut} € / mois. <br />
                    Seuil minimal légal {annee.tauxMinimal} %
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <InputController name="contrat.salaireEmbauche" />

        <Box color="grey.600">
          {!smic?.isSmicException && (
            <Typography>
              Calculé sur la base du SMIC {smic?.annee} de {smic?.selectedSmic}€ brut mensuel [Date d&apos;entrée en
              vigueur {smic?.dateEntreeEnVigueur}]
            </Typography>
          )}
          {smic?.isSmicException && (
            <Typography>
              Calculé sur la base du SMIC {smic?.annee} pour{" "}
              <strong>{smic?.exceptions[employeurAdresseDepartement]?.nomDepartement}</strong> de {smic?.selectedSmic}€
              brut mensuel [Date d&apos;entrée en vigueur {smic?.dateEntreeEnVigueur}]
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
