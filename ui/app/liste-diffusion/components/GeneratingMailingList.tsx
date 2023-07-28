import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { IJobJson } from "shared/models/job.model";

import { apiGet } from "../../../utils/api.utils";

interface Props {
  mailingList: IJobJson;
  onDone: () => void;
}

const doneStatuses: IJobJson["status"][] = ["finished", "errored", "blocked"];

const GeneratingMailingList: FC<Props> = ({
  mailingList: initialMailingList,
  onDone,
}) => {
  const [mailingList, setMailingList] = useState<IJobJson>(initialMailingList);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progression = Math.ceil((mailingList.payload as any)?.processed ?? 0);

  const fetchMailingList = async () => {
    const data = await apiGet(`/mailing-lists/:id`, {
      params: { id: mailingList._id },
    });
    setMailingList(data);

    if (doneStatuses.includes(data.status)) {
      onDone();
    }
  };

  useEffect(() => {
    const id = setInterval(fetchMailingList, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <Box textAlign="center" pt="4" pb="6">
      <Center>
        <Image
          src="/images/televersement.svg"
          alt="Liste de diffusion en cours de génération"
          width={200}
          height={90}
        />
      </Center>
      <Heading as="h3" fontSize="3xl" mb="2">
        Génération en cours...
      </Heading>
      <Text mb="2">
        Veuillez patienter pendant la génération de votre liste de diffusion.
      </Text>
      <Text mb="2">
        Vous pourrez télécharger le fichier dans la liste ci-dessous une fois
        l'opération terminée.
      </Text>
      <Text mb="2">Progression : {progression} %</Text>
    </Box>
  );
};

export default GeneratingMailingList;
