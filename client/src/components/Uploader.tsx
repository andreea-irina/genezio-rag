import * as React from "react";
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

export default function Uploader({
  file,
  onUpload,
}: {
  file: File | null;
  onUpload: (file: File | null, base64: string) => void;
}) {
  const [uploaded, setUploaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setUploaded(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onUpload(file, reader.result);
        } else setError("Error reading file");
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
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
            <Text>Click the button below</Text>

            <Group align="center">
              <FileButton onChange={handleFileChange} accept="file/pdf">
                {(props) => (
                  <Button {...props} leftSection={<IconFileUpload size={20} />}>
                    Upload File
                  </Button>
                )}
              </FileButton>
            </Group>

            {error && <Text c="red">{error}</Text>}
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
