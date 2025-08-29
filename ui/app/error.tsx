"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Box, Container, Typography } from "@mui/material";
import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

import Link from "next/link";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { publicConfig } from "@/config.public";
import { NotFound } from "@/icons/NotFound";
import { ApiError } from "@/utils/api.utils";

function getErrorDescription(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (error instanceof ApiError) {
    return error.context.statusCode < 500 || publicConfig.env === "local" ? error.context.message : null;
  }

  if (publicConfig.env === "local") {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }
  }

  return null;
}

export default function ErrorComponent({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    captureException(error);
    console.error(error);
  }, [error]);

  const resetUseQuery = useQueryErrorResetBoundary();

  const details = getErrorDescription(error);

  return (
    <Container maxWidth="xl">
      <Box>
        <Box
          padding={8}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          margin="auto"
          maxWidth="600px"
          textAlign="center"
        >
          <NotFound />

          <Box mt={4}>
            <Typography variant="h1" gutterBottom>
              Une erreur est survenue
            </Typography>
            {details && <Typography gutterBottom>{details}</Typography>}

            <Box mt={2}>
              <Button
                onClick={() => {
                  resetUseQuery.reset();
                  reset();
                }}
                type="button"
              >
                Essayer à nouveau
              </Button>
            </Box>

            <Box mt={2}>
              <Link href="/">Retourner à la page d'accueil</Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
