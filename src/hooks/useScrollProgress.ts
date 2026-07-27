import { useEffect, useRef, type RefObject } from "react";

interface Options {
  /** 진행률(0~1)을 담을 CSS 변수 이름. 예: "--zaru-progress" */
  varName?: string;
  /** 진행 구간의 길이(px). 기본값은 요소 높이. */
  span?: (el: HTMLElement) => number;
  /** 진행률이 갱신될 때마다 호출. 리렌더가 필요하면 여기서 "좁게" 갱신할 것. */
  onProgress?: (progress: number) => void;
  enabled?: boolean;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** 요소가 스크롤을 통과하는 정도를 0→1 로 계산해 CSS 변수에 쓴다.
 *
 *  요소 top 이 뷰포트 top 에 닿는 순간 0, span 만큼 더 스크롤하면 1.
 *  값은 CSS 변수로 직접 쓰기 때문에 프레임마다 리렌더가 일어나지 않는다.
 *  (transform / opacity 만 건드리도록 CSS 쪽에서 사용) */
export function useScrollProgress<T extends HTMLElement>({
  varName = "--zaru-progress",
  span,
  onProgress,
  enabled = true,
}: Options = {}): RefObject<T> {
  const ref = useRef<T>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.style.setProperty(varName, "0");
      onProgressRef.current?.(0);
      return;
    }

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      const length = span ? span(el) : el.offsetHeight;
      if (length <= 0) return;

      const progress = clamp01(-el.getBoundingClientRect().top / length);
      if (Math.abs(progress - last) < 0.001) return;
      last = progress;

      el.style.setProperty(varName, progress.toFixed(4));
      onProgressRef.current?.(progress);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [varName, span, enabled]);

  return ref;
}
