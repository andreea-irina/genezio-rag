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
import Markdown from "react-markdown";

import Loading from "./Loading";

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
      <Text size="sm" c={isUser ? "cyan" : "teal"}>
        {isUser ? "You" : "AI"}
      </Text>
      {isUser ? <Text>{message}</Text> : <Markdown>{message}</Markdown>}
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
        radius="xl"
        size="md"
        rows={1}
        maxRows={2}
        style={{ flex: 1 }}
        styles={{
          input: {
            padding: "10px 20px",
          },
        }}
        rightSection={
          <ActionIcon
            onClick={handleSend}
            variant="subtle"
            style={{ marginRight: "20px" }}
          >
            <IconSend size={20} />
          </ActionIcon>
        }
      />
    </Group>
  );
}

export default function Chat({
  onAsk,
}: {
  onAsk: (q: string) => Promise<string>;
}) {
  const [messages, setMessages] = React.useState([
    { text: "Hello, how can I help you?", isUser: false },
  ]);
  const [loading, setLoading] = React.useState(false);

  const handleSend = async (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true },
    ]);

    try {
      setLoading(true);
      const answer = await onAsk(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: answer, isUser: false },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, I couldn't understand that.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
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

          {loading && <Loading />}
        </Stack>
      </ScrollArea>

      <ChatInput onSend={handleSend} />
    </>
  );
}
