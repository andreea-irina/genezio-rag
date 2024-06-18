import { Group } from "@mantine/core";

const Loading = () => {
  return (
    <Group align="center" pl={16} c="teal">
      <svg width="80" height="20" viewBox="0 0 80 20" fill="currentColor">
        <circle cx="10" cy="10" r="3">
          <animate
            attributeName="r"
            from="3"
            to="3"
            begin="0s"
            dur="1.5s"
            values="3;6;3"
            calcMode="linear"
            repeatCount="indefinite"
            fill="currentColor"
          />
        </circle>
        <circle cx="30" cy="10" r="3">
          <animate
            attributeName="r"
            from="3"
            to="3"
            begin="0.3s"
            dur="1.5s"
            values="3;6;3"
            calcMode="linear"
            repeatCount="indefinite"
            fill="currentColor"
          />
        </circle>
        <circle cx="50" cy="10" r="3">
          <animate
            attributeName="r"
            from="3"
            to="3"
            begin="0.6s"
            dur="1.5s"
            values="3;6;3"
            calcMode="linear"
            repeatCount="indefinite"
            fill="currentColor"
          />
        </circle>
      </svg>
    </Group>
  );
};

export default Loading;
