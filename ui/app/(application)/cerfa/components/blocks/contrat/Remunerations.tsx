import { fr } from "@codegouvfr/react-dsfr";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { Box, Typography } from "@mui/material";
import { format, getDate, parseISO, setDate, subMonths } from "date-fns";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useRecoilState } from "recoil";
import { shouldShowRemunerationsAnnuelles } from "shared/helpers/cerfa/domains/contrat/shouldShowRemunerationsAnnuelles";
import { formatDate } from "utils/date.utils";

import InformationMessage from "../../../../components/InformationMessage";
import InformationMessages from "../../../../components/InformationMessages";
import Markdown from "../../../../components/Markdown";
import { fieldsState } from "../../../atoms/fields.atom";
import CollapseController from "../../CollapseController";
import InputController from "../inputs/InputController";
import InputGroupContainer from "../inputs/inputGroup/InputGroupContainer";
import InputGroupItem from "../inputs/inputGroup/InputGroupItem";
import ConditionItem from "./ConditionItem";
import SmcField from "./SmcField";

const getAnneeLabel = (ordre: 1.1 | 2.1 | 3.1 | 4.1) => {
  return {
    1.1: "1ère année d'exécution du contrat",
    2.1: "2ème année d'exécution du contrat",
    3.1: "3ème année d'exécution du contrat",
    4.1: "4ème année d'exécution du contrat",
  }[ordre];
};

export const Remunerations = () => {
  const { getValues } = useFormContext(); // retrieve those props
  const values = getValues();
  const [fields] = useRecoilState(fieldsState);

  const dateDebutContrat = values.contrat.dateDebutContrat;
  const dateFinContrat = values.contrat.dateFinContrat;
  const apprentiDateNaissance = values.apprenti.dateNaissance;
  const employeurAdresseDepartement = values.employeur.adresse.departement;
  const smic = values.contrat.smic;
  const remunerationsAnnuelles = values.contrat.remunerationsAnnuelles;

  return (
    <Box
      padding={4}
      mb={4}
      border="1px dashed black"
      borderRadius="8px"
      borderColor={fr.colors.decisions.border.plain.grey.default}
    >
      <Typography variant="h4" gutterBottom>
        Rémunération
      </Typography>
      <Box mb={2}>
        <InformationMessages messages={fields["contrat.opco"]?.informationMessages ?? []} />
        <InformationMessage
          type="assistive"
          collapse={{
            label: "En savoir plus",
            content: (
              <Markdown>
                {`Exemples de situations spécifiques à l'apprentissage : entrée en apprentissage en cours de cycle de formation, rémunération du contrat d'apprentissage préparant à une licence professionnelle, majorations règlementaires, apprentis ayant une reconnaissance de travailleur handicapé, succession de contrats avec le même employeur ou avec un employeur différent.
            
En savoir plus sur les situations spécifiques sur le [site du Ministère du Travail, de l'Emploi et de l'Insertion](https://travail-emploi.gouv.fr/formation-professionnelle/formation-en-alternance-10751/apprentissage/contrat-apprentissage#salaire).`}
              </Markdown>
            ),
          }}
        >
          <>
            <Typography>
              Le calcul de rémunération proposé est réalisé en fonction des éléments du contrat que vous avez
              renseignés. Toutefois, veuillez noter que ce calcul :
            </Typography>
            <Box component="ul">
              <Typography component="li">
                indique la rémunération minimale légale et que vous pouvez décider d'attribuer une rémunération plus
                avantageuse ;
              </Typography>
              <Typography component="li">ne tient pas encore compte de situations spécifiques</Typography>
            </Box>
            <Typography>Vous pouvez donc modifier les montants indiqués pour tenir compte de ces éléments.</Typography>
          </>
        </InformationMessage>
      </Box>

      {(dateDebutContrat === "" ||
        dateFinContrat === "" ||
        apprentiDateNaissance === "" ||
        employeurAdresseDepartement === "") && (
        <Box>
          <Typography>
            L&apos;outil détermine les périodes de rémunération et s&apos;assure du respect du minimum légale pour
            chacune des périodes, à partir des éléments renseignés.
          </Typography>
          <Box component="ul" padding={0} sx={{ listStyle: "none" }}>
            <ConditionItem state={apprentiDateNaissance === "" ? "error" : "success"}>
              La date de naissance de l&apos;apprenti
            </ConditionItem>
            <ConditionItem state={dateDebutContrat === "" ? "error" : "success"}>
              La date de début d&apos;exécution du contrat
            </ConditionItem>
            <ConditionItem state={dateFinContrat === "" ? "error" : "success"}>La date de fin du contrat</ConditionItem>
            <ConditionItem state={employeurAdresseDepartement === "" ? "error" : "success"}>
              Le département de l&apos;employeur
            </ConditionItem>
          </Box>
        </Box>
      )}
      <CollapseController show={shouldShowRemunerationsAnnuelles}>
        <SmcField />
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

                <InputGroupContainer>
                  <InputGroupItem size={6}>
                    <InputController name={`contrat.remunerationsAnnuelles.${i}.dateDebut`} />
                  </InputGroupItem>
                  <InputGroupItem size={6}>
                    <InputController name={`contrat.remunerationsAnnuelles.${i}.dateFin`} />
                  </InputGroupItem>
                </InputGroupContainer>

                <Box display="flex">
                  <InputController name={`contrat.remunerationsAnnuelles.${i}.taux`} />
                  <Box mt={4}>
                    <Typography variant="caption" whiteSpace="nowrap">
                      soit {annee.salaireBrut} € / mois. <br />
                      Seuil minimal légal {annee.tauxMinimal} %
                    </Typography>
                  </Box>
                </Box>
                {annee.isChangingTaux &&
                  (() => {
                    const age = annee.newSeuil;
                    const applicationDate = formatDate(annee.dateDebut);
                    const birthday = getDate(parseISO(apprentiDateNaissance));
                    const birthdayDate = birthday
                      ? format(setDate(subMonths(new Date(annee.dateDebut), 1), birthday), "dd/MM/yyyy")
                      : undefined;
                    return (
                      <Notice
                        title={`Votre apprenti aura ${age} ans en date du ${birthdayDate}. Ce faisant, un nouveau seuil s’applique en date du ${applicationDate}.`}
                      />
                    );
                  })()}
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
      </CollapseController>
    </Box>
  );
};
