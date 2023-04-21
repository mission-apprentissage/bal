import { Box, Button, Input, Spinner, Text } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

import { DownloadLine } from "../../../../theme/icons/DownloadLine";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderColor: "#E5E5E5",
  borderStyle: "dashed",
  color: "#9c9c9c",
  transition: "border .24s ease-in-out",
} as const;

const activeStyle = {
  borderColor: "#3a55d1",
} as const;

interface Props {
  options: DropzoneOptions;
  isLoading: boolean;
}

export const Dropzone: FC<Props> = ({ options, isLoading }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone(options);

  const { size: _size, ...inputProps } = getInputProps();

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
    }),
    [isDragActive]
  );
  return (
    <Box {...getRootProps({ style })} minH="200px">
      {isLoading ? (
        <Box textAlign="center" flex="1" flexDirection="column">
          <Spinner />
          {/* <Text mt={2}>{lastMessage}</Text> */}
        </Box>
      ) : (
        <>
          <Input {...inputProps} />
          {isDragActive ? (
            <Text>Glissez et déposez ici ...</Text>
          ) : (
            <>
              <DownloadLine boxSize="4" color="bluefrance" mb={4} />
              <Text color="mgalt">
                Glissez le fichier dans cette zone ou cliquez sur le bouton pour
                ajouter un document depuis votre disque dur
              </Text>
              <Text color="mgalt">(.csv, maximum 10mb)</Text>
              <Button size="md" variant="secondary" mt={4}>
                Ajouter un document
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};
