import { useEffect } from "react";

/** 공통 리빌 유틸.
 *  페이지의 모든 `.reveal` 을 한 개의 IntersectionObserver 로 감시하다가
 *  화면에 들어오면 `.is-visible` 을 붙이고 관찰을 끊는다(1회성).
 *
 *  DESIGN.md: threshold 0.12 / rootMargin 0 0 -7% 0 / opacity+translateY / 0.7~0.8s
 *  스태거는 요소의 `style="--reveal-delay: 120ms"` 로 준다. */
export function useRevealObserver(enabled = true): void {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    // 모션 최소화 또는 IO 미지원 → 애니메이션 없이 바로 보이게.
    if (!enabled || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
}
