import { useEffect, useState } from "react";

/** 미디어쿼리 일치 여부. CSS 로 못 푸는 "동작 자체를 바꿔야 하는" 경우에만 쓴다.
 *  (예: 모바일에서는 스크롤 연동 계산을 아예 돌리지 않는다) */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
