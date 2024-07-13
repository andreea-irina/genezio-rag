import * as React from "react";
import { AppShell, Stack, Transition } from "@mantine/core";
import { ChatService } from "@genezio-sdk/genezio-rag";

import Uploader from "./components/Uploader";
import Chat from "./components/Chat";

export default function App() {
  const [step, setStep] = React.useState<"upload" | "chat">("upload");
  const [file, setFile] = React.useState<File | null>(null);
  const [isSettingUp, setIsSettingUp] = React.useState(true);

  React.useEffect(() => {
    if (file) {
      setStep("chat");
    }
  }, [file]);

  async function handleUpload(file: File | null, base64?: string) {
    setFile(file);

    if (file) {
      setIsSettingUp(true);
      await ChatService.extractData();
      setIsSettingUp(false);
    }
  }

  async function handleAskQuestion(question: string) {
    const answer = await ChatService.chat(question);

    return answer;
  }

  return (
    <AppShell h="100%" style={{ overflow: "hidden" }}>
      <Stack align="center" justify="center" w="100%" h="100%" py={6}>
        <Uploader file={file} onUpload={handleUpload} />

        <Transition
          mounted={step === "chat"}
          transition="slide-up"
          duration={500}
          timingFunction="ease"
        >
          {(styles) => (
            <Stack w={800} h={600} style={styles}>
              <Chat onAsk={handleAskQuestion} isSettingUp={isSettingUp} />
            </Stack>
          )}
        </Transition>
      </Stack>
    </AppShell>
  );
}
