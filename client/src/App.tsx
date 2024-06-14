import * as React from "react";
import { AppShell, Stack, Transition } from "@mantine/core";
import { ChatService } from "@genezio-sdk/genezio-rag";

import Uploader from "./components/Uploader";
import Chat from "./components/Chat";

export default function App() {
  const [step, setStep] = React.useState<"upload" | "chat">("upload");
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (file) {
      setStep("chat");
    }
  }, [file]);

  return (
    <AppShell h="100%" style={{ overflow: "hidden" }}>
      <Stack align="center" justify="center" w="100%" h="100%">
        <Uploader file={file} setFile={setFile} />

        <Transition
          mounted={step === "chat"}
          transition="slide-up"
          duration={500}
          timingFunction="ease"
        >
          {(styles) => (
            <Stack miw={800} mih={600} style={styles}>
              <Chat />
            </Stack>
          )}
        </Transition>
      </Stack>
    </AppShell>
  );
}
