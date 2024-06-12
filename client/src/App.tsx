import { useState } from "react";
import { ChatService } from "@genezio-sdk/genezio-rag";

import reactLogo from "./assets/react.svg";
import "./App.css";

export default function App() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");

  async function extractData() {
    ChatService.extractData();
  }

  return (
    <>
      <div>
        <a href="https://genezio.com" target="_blank">
          <img
            src="https://raw.githubusercontent.com/Genez-io/graphics/main/svg/Logo_Genezio_White.svg"
            className="logo genezio light"
            alt="Genezio Logo"
          />
          <img
            src="https://raw.githubusercontent.com/Genez-io/graphics/main/svg/Logo_Genezio_Black.svg"
            className="logo genezio dark"
            alt="Genezio Logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Genezio + React = ❤️</h1>
      <div className="card">
        <input
          type="text"
          className="input-box"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <br />
        <br />

        <button onClick={() => extractData()}>Say Hello</button>
        <p className="read-the-docs">{response}</p>
      </div>
    </>
  );
}
