import {
  Box,
  Button,
  HStack,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { FC, useMemo, useState } from "react";
import { DropEvent, DropzoneOptions, useDropzone } from "react-dropzone";

import { Bin } from "../../../../../theme/icons/Bin";
import { DownloadLine } from "../../../../../theme/icons/DownloadLine";
import { File } from "../../../../../theme/icons/File";
import { formatBytes } from "../../../../../utils/file.utils";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderColor: "grey.925",
  borderStyle: "dashed",
  color: "grey.625",
  transition: "border .24s ease-in-out",
} as const;

const activeStyle = {
  borderColor: "blue_cumulus_sun_368.active",
} as const;

interface Props {
  options: DropzoneOptions;
  isDisabled: boolean;
}

export const Dropzone: FC<Props> = ({ options, isDisabled }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop: DropzoneOptions["onDrop"] = (
    acceptedFiles,
    fileRejections,
    event
  ) => {
    setFiles(acceptedFiles);
    options.onDrop?.(acceptedFiles, fileRejections, event);
  };

  const handleDelete = (file: File) => {
    const filteredFiles = files.filter((f) => f.name !== file.name);
    setFiles(filteredFiles);
    onDrop(filteredFiles, [], {} as DropEvent);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...options,
    onDrop,
  });

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
      {files.length ? (
        <List w="full">
          {files.map((file) => {
            return (
              <ListItem
                key={file.name}
                borderBottom="solid 1px"
                borderColor="grey.925"
                pb={3}
              >
                <HStack>
                  <File boxSize="5" color="blue_france.main" />
                  <Box flexGrow={1}>
                    <Text>
                      {file.name} - {formatBytes(file.size)}
                    </Text>
                  </Box>
                  {!isDisabled && (
                    <Bin
                      boxSize="5"
                      color="red_marianne"
                      cursor="pointer"
                      onClick={() => handleDelete(file)}
                    />
                  )}
                </HStack>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <>
          <Input {...inputProps} />
          {isDragActive ? (
            <Text>Glissez et déposez ici ...</Text>
          ) : (
            <>
              <DownloadLine boxSize="4" color="blue_france.main" mb={4} />
              <Text color="grey.425">
                Glissez le fichier dans cette zone ou cliquez sur le bouton pour
                ajouter un document depuis votre disque dur
              </Text>
              <Text color="grey.425">(.csv, maximum 100mb)</Text>
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
