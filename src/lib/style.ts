import type { CSSProperties } from "react";

/** 리빌 스태거용. `style={revealDelay(120)}` 처럼 쓴다. */
export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

/** 순번을 CSS 변수 --i 로 넘겨 CSS 쪽에서 지연을 계산하게 한다. */
export function order(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}
