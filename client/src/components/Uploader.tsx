import {
  Stack,
  Title,
  FileButton,
  Button,
  Group,
  Text,
  Transition,
} from "@mantine/core";
import { IconFileUpload, IconPaperclip } from "@tabler/icons-react";
import { useState } from "react";

export default function Uploader({
  file,
  setFile,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (file) {
      setUploaded(true);
    }
  };

  return (
    <Stack align="center" justify="center" w="100%">
      <Transition
        mounted={!uploaded}
        transition="slide-up"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <Stack align="center" style={styles}>
            <Title order={1}>Upload your files</Title>
            <Text>Drag and drop your files here</Text>

            <Group align="center">
              <FileButton onChange={handleFileChange} accept="image/*">
                {(props) => (
                  <Button {...props} leftSection={<IconFileUpload size={20} />}>
                    Upload File
                  </Button>
                )}
              </FileButton>
            </Group>
          </Stack>
        )}
      </Transition>

      <Transition
        mounted={uploaded}
        transition="slide-down"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <Group align="center" style={styles}>
            <FileButton onChange={handleFileChange} accept="image/*">
              {(props) => (
                <Button
                  {...props}
                  color="gray"
                  variant="outline"
                  leftSection={<IconPaperclip size={20} />}
                >
                  {file?.name}
                </Button>
              )}
            </FileButton>
          </Group>
        )}
      </Transition>
    </Stack>
  );
}
