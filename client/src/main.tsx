import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";

import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
