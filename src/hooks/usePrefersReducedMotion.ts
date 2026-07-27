import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** 사용자가 모션 최소화를 켰는지. 켜져 있으면 스크롤 연동 애니메이션을 아예 돌리지 않고
 *  최종 상태(다 보이는 상태)로 고정한다. CSS 쪽에도 같은 미디어쿼리 가드가 있다. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
