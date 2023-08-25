"use client";
import { Accordion, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IBody, IPostRoutes } from "shared";

import { apiGet } from "../../../utils/api.utils";
import Breadcrumb, { PAGES } from "../../components/breadcrumb/Breadcrumb";
import ChoixColonnesIdentifiant from "./components/ChoixColonnesIdentifiant";
import ChoixColonnesSortie from "./components/ChoixColonnesSortie";
import ChoixSource from "./components/ChoixSource";
import CreateMailingListSection from "./components/CreateMailingListSection";

const NouvelleListePage = () => {
  const [step, setStep] = useState<number>(0);
  const [source, setSource] = useState<string>();
  const [campaignName, setCampaignName] = useState<string>();
  const [identifierColumns, setIdentifierColumns] = useState<string[]>();
  const [email, setEmail] = useState<string>();
  const [secondaryEmail, setSecondaryEmail] = useState<string | undefined>();
  const { push } = useRouter();

  const { data: columns = [] } = useQuery<string[]>({
    queryKey: ["documentColumns", source],
    queryFn: async () => {
      const data = await apiGet("/documents/columns", {
        querystring: { type: source ?? "" },
      });

      return data;
    },
  });

  const handleSourceSelection = (data: IBody<IPostRoutes["/mailing-list"]>) => {
    setSource(data.source);
    setCampaignName(data.campaign_name);
    setStep(1);
  };

  const handleIdentifierColumnsSelection = (
    data: Pick<
      IBody<IPostRoutes["/mailing-list"]>,
      "email" | "secondary_email" | "identifier_columns"
    >
  ) => {
    setIdentifierColumns(data.identifier_columns);
    setEmail(data.email);
    setSecondaryEmail(data.secondary_email);
    setStep(2);
  };

  const handleOutputColumnsSelection = () => {
    push(PAGES.listeDiffusion().path);
  };

  return (
    <>
      <Breadcrumb
        pages={[
          PAGES.homepage(),
          PAGES.listeDiffusion(),
          PAGES.nouvelleListe(),
        ]}
      />

      <Heading as="h2" fontSize="2xl" mt={8} mb={4}>
        Créer nouvelle liste
      </Heading>

      <Accordion index={step}>
        <CreateMailingListSection title="Choix de la source">
          <ChoixSource onSuccess={handleSourceSelection} />
        </CreateMailingListSection>
        <CreateMailingListSection title="Champs d'identification et de contact">
          <ChoixColonnesIdentifiant
            columns={columns}
            onSuccess={handleIdentifierColumnsSelection}
            onCancel={() => setStep(0)}
          />
        </CreateMailingListSection>
        <CreateMailingListSection title="Champs à afficher dans le fichier de sortie">
          {campaignName &&
            source &&
            !!columns.length &&
            identifierColumns &&
            email && (
              <ChoixColonnesSortie
                columns={columns}
                source={source}
                campaignName={campaignName}
                identifierColumns={identifierColumns}
                onSuccess={handleOutputColumnsSelection}
                email={email}
                secondaryEmail={secondaryEmail}
                onCancel={() => setStep(1)}
              />
            )}
        </CreateMailingListSection>
      </Accordion>
    </>
  );
};

export default NouvelleListePage;
