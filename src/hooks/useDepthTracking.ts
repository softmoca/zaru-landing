import { useEffect } from "react";
import { trackOnce } from "../lib/analytics";

const MARKS = [25, 50, 75, 100] as const;

/** 스크롤 깊이 25 / 50 / 75 / 100% 도달을 각각 1회씩 기록한다.
 *  어디서 이탈하는지(= 어느 섹션이 안 먹히는지) 보는 용도. */
export function useDepthTracking(): void {
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const percent =
        max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 100;

      for (const mark of MARKS) {
        if (percent >= mark) {
          trackOnce(`depth:${mark}`, "depth", { target: mark });
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);
}
