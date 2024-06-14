import * as React from "react";
import {
  Stack,
  Text,
  Group,
  ScrollArea,
  Box,
  ActionIcon,
  Textarea,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

function ChatMessage({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) {
  return (
    <Box
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#2f2f2f" : "transparent",
        color: "#ececec",
        padding: "10px 20px",
        marginBottom: "10px",
        borderRadius: "35px",
        wordBreak: "break-word",
      }}
    >
      <Text>{message}</Text>
    </Box>
  );
}

function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
      inputRef?.current?.focus();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Group component="form" w="100%" mt="sm">
      <Textarea
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        radius="lg"
        size="md"
        rows={1}
        maxRows={2}
        style={{ flex: 1 }}
        styles={{
          input: {
            padding: "0.75rem",
          },
        }}
        rightSection={
          <ActionIcon onClick={handleSend} variant="subtle">
            <IconSend size={20} />
          </ActionIcon>
        }
      />
    </Group>
  );
}

export default function Chat() {
  const [messages, setMessages] = React.useState([
    { text: "Hello, how can I help you?", isUser: false },
    { text: "I have a question about your services.", isUser: true },
  ]);

  const handleSend = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true },
    ]);
  };

  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <>
      <ScrollArea
        style={{ flex: 1, padding: "16px", borderTop: "1px solid #2f2f2f" }}
        viewportRef={scrollAreaRef}
      >
        <Stack gap={1}>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
        </Stack>
      </ScrollArea>

      <ChatInput onSend={handleSend} />
    </>
  );
}
