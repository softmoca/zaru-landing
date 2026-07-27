import { useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProgressBar } from "./components/ProgressBar";
import { StickyJourney } from "./components/StickyJourney";
import { useDepthTracking } from "./hooks/useDepthTracking";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useRevealObserver } from "./hooks/useRevealObserver";
import { captureSrc, track } from "./lib/analytics";

export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  // 모션 최소화면 리빌을 돌리지 않고 처음부터 보이게 한다.
  useRevealObserver(!reducedMotion);
  useDepthTracking();

  useEffect(() => {
    captureSrc(); // ?src= 를 세션에 저장 → 이후 모든 이벤트에 붙는다
    void track("view");
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <ProgressBar />
      <Header />

      <main id="main">
        {/* [1] 히어로 */}
        <Hero />

        {/* [5] 4축 스티키 저니 ★ */}
        <StickyJourney />
      </main>
    </>
  );
}
