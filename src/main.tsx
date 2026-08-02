import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { VariantSwitch } from "./components/VariantSwitch";
import { LandingAlert } from "./variants/LandingAlert";
import { LandingReport } from "./variants/LandingReport";
import { captureSrc } from "./lib/analytics";
import "./styles/tokens.css";
import "./styles/styles.css";
import "./styles/variant-switch.css";

// 렌더보다 먼저 유입 경로를 확정한다. (첫 이벤트에 src 가 빠지지 않게)
captureSrc();

const root = document.getElementById("root");
if (!root) throw new Error("#root 를 찾지 못했습니다.");

const requestedVariant = new URLSearchParams(window.location.search).get("variant");
const activeVariant = requestedVariant === "2" ? 2 : requestedVariant === "3" ? 3 : 1;
const Landing = activeVariant === 2 ? LandingAlert : activeVariant === 3 ? LandingReport : App;

if (activeVariant === 2) {
  document.title = "자취선배 — 싸다는 말 뒤의 손실 고지서";
} else if (activeVariant === 3) {
  document.title = "자취선배 — 내 방 임장 리포트";
}

createRoot(root).render(
  <React.StrictMode>
    <Landing />
    <VariantSwitch active={activeVariant} />
  </React.StrictMode>
);
