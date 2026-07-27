import { useEffect, useRef, useState, type RefObject } from "react";

interface Options {
  threshold?: number;
  rootMargin?: string;
  /** 한 번 보이면 그대로 유지 (기본 true) */
  once?: boolean;
}

/** 요소 하나가 화면에 들어왔는지. 카운트업 시작처럼 "한 번만" 필요한 트리거에 쓴다. */
export function useInView<T extends HTMLElement>(
  { threshold = 0.2, rootMargin = "0px", once = true }: Options = {}
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
