import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import { api } from "../../../utils/api.utils";

interface Props {
  mailingList: IJob;
  onDone: () => void;
}

const GeneratingMailingList: FC<Props> = ({
  mailingList: initialMailingList,
  onDone,
}) => {
  const [mailingList, setMailingList] = useState<IJob>(initialMailingList);
  const progression = Math.ceil(
    (mailingList.payload?.processed as number) ?? 0
  );

  const fetchMailingList = async () => {
    const { data } = await api.get(`/mailing-lists/${mailingList._id}`);
    setMailingList(data);

    if (
      [
        JOB_STATUS_LIST.FINISHED,
        JOB_STATUS_LIST.ERRORED,
        JOB_STATUS_LIST.BLOCKED,
      ].includes(data.status)
    ) {
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
