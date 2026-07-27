import { useEffect, useState } from "react";

/** 0 → target 카운트업. active 가 true 가 되는 순간 한 번 돈다.
 *  모션 최소화면 즉시 최종값. */
export function useCountUp(
  target: number,
  active: boolean,
  { duration = 1100, instant = false }: { duration?: number; instant?: boolean } = {}
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (instant) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out — 끝에서 부드럽게 멈춘다
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, instant]);

  return value;
}
