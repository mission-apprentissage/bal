import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FC } from "react";
import { IJobJson } from "shared/models/job.model";
import { IMailingListJson } from "shared/models/mailingList.model";

import { apiGet } from "../../../utils/api.utils";

interface Props {
  mailingList: IMailingListJson;
  onDone: () => void;
}

const doneStatuses: IJobJson["status"][] = ["finished", "errored", "blocked"];

const GeneratingMailingList: FC<Props> = ({ mailingList, onDone }) => {
  const { data: progress } = useQuery({
    queryKey: ["generatingMailingListProgress"],
    queryFn: async () => {
      const data = await apiGet("/mailing-lists/:id/progress", {
        params: { id: mailingList._id },
      });

      if (doneStatuses.includes(data.status)) {
        onDone();
      }

      return data;
    },
    refetchInterval: 1000,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progression = Math.ceil(progress?.processed ?? 0);

  return (
    <Box textAlign="center" my={4}>
      <CallOut title="Génération en cours...">
        <Box display="flex" justifyContent="center" m={2}>
          <Image
            src="/images/televersement.svg"
            alt="Liste de diffusion en cours de génération"
            width={200}
            height={90}
          />
        </Box>
        <Typography mb="2">
          Veuillez patienter pendant la génération de votre liste de diffusion.
        </Typography>
        <Typography mb="2">
          Cette opération peut durer jusqu’à 2 heures selon la taille du
          fichier, vous pouvez quitter cette page et revenir plus tard.
        </Typography>
        <Typography mb="2">Progression : {progression} %</Typography>
      </CallOut>
    </Box>
  );
};

export default GeneratingMailingList;
