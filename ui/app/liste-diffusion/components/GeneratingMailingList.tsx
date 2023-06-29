import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import { IJob } from "shared/models/job.model";

interface Props {
  mailingList: IJob;
}

const GeneratingMailingList: FC<Props> = ({ mailingList }) => {
  const progression = Math.ceil(
    (mailingList.payload?.processed as number) ?? 0
  );
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
