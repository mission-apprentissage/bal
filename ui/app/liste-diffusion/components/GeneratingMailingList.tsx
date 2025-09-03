import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Box, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import type { FC } from "react";
import { useState } from "react";
import type { IDocument } from "shared/models/document.model";
import type { IMailingListWithDocumentAndOwnerJson } from "shared/models/mailingList.model";

import { apiGet } from "@/utils/api.utils";

interface Props {
  mailingList?: IMailingListWithDocumentAndOwnerJson;
  onDone: () => void;
}

function shouldRefetch(status: IDocument["job_status"] | null): boolean {
  return status !== "done" && status !== "error";
}

const GeneratingMailingList: FC<Props> = ({ mailingList, onDone }) => {
  const [allowRefetch, setAllowRefetch] = useState(shouldRefetch(mailingList?.document?.job_status ?? null));
  const queryClient = useQueryClient();

  const mailingListId = mailingList?._id;

  const { data: progress } = useQuery({
    queryKey: ["generatingMailingListProgress", mailingListId],
    enabled: allowRefetch,
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) {
        return null;
      }

      const data = await apiGet("/mailing-lists/:id/progress", {
        params: { id: queryKey[1] },
      });

      if (!shouldRefetch(data.status)) {
        setAllowRefetch(false);
        await queryClient.invalidateQueries({ queryKey: ["mailingLists"] });
      }

      if (data.status === "done") {
        onDone();
      }

      return data;
    },
    refetchInterval: 10_000,
  });

  const lineCount = progress?.lines_count ?? 0;
  const importCount = progress?.process_progress ?? 0;
  const progression = lineCount === 0 ? 0 : Math.ceil((importCount / lineCount) * 100);

  if (progress?.status === "done") {
    return (
      <Box my={2}>
        <Alert
          title="Votre liste de diffusion est prête !"
          description="Retrouvez votre liste de diffusion en première ligne de votre tableau."
          severity="success"
        />
      </Box>
    );
  }

  if (progress?.status === "error") {
    return (
      <Box my={2}>
        <Alert
          title="Une erreur est survenue"
          description="Une erreur est survenue lors de la génération de votre liste de diffusion. Veuillez réessayer plus tard."
          severity="error"
        />
      </Box>
    );
  }

  if (!mailingList || !progress) {
    return null;
  }

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
        <Typography mb="2">Veuillez patienter pendant la génération de votre liste de diffusion.</Typography>
        <Typography mb="2">
          Cette opération peut durer jusqu'à 2 heures selon la taille du fichier, vous pouvez quitter cette page et
          revenir plus tard.
        </Typography>
        <Typography mb="2">Progression : {progression} %</Typography>
      </CallOut>
    </Box>
  );
};

export default GeneratingMailingList;
