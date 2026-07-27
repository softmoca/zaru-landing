import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { captureSrc } from "./lib/analytics";
import "./styles/tokens.css";
import "./styles/styles.css";

// 렌더보다 먼저 유입 경로를 확정한다. (첫 이벤트에 src 가 빠지지 않게)
captureSrc();

const root = document.getElementById("root");
if (!root) throw new Error("#root 를 찾지 못했습니다.");

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
