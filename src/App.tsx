import { useEffect } from "react";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LoopSection } from "./components/LoopSection";
import { Preorder } from "./components/Preorder";
import { Problems } from "./components/Problems";
import { ProgressBar } from "./components/ProgressBar";
import { Scenario } from "./components/Scenario";
import { StickyJourney } from "./components/StickyJourney";
import { Timeline } from "./components/Timeline";
import { ValidationPlan } from "./components/ValidationPlan";
import { useDepthTracking } from "./hooks/useDepthTracking";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useRevealObserver } from "./hooks/useRevealObserver";
import { trackOnce } from "./lib/analytics";

export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  // 모션 최소화면 리빌을 돌리지 않고 처음부터 보이게 한다.
  useRevealObserver(!reducedMotion);
  useDepthTracking();

  // ?src= 는 main.tsx 에서 이미 확정해 뒀다. 여기선 진입만 1회 기록한다.
  // (StrictMode 가 개발 중 effect 를 두 번 돌려도 중복 전송되지 않게 trackOnce)
  useEffect(() => {
    trackOnce("view", "view");
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <ProgressBar />
      <Header />

      <main id="main">
        <Hero />
        <Problems />
        <About />
        <StickyJourney />
        <Scenario />
        <LoopSection />
        <Timeline />
        <ValidationPlan />
        <Preorder />
      </main>

      <Footer />
    </>
  );
}
