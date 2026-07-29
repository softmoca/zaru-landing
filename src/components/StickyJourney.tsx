import { useEffect, useRef, useState } from "react";
import { trackOnce } from "../lib/analytics";

const MOMENTS = [
  {
    n: 1,
    title: "나의 조건을 입력합니다",
    quote: "나와 가구의 기본 조건부터",
    body: "나이·소득·가구 조건과 현재 지역, 과거 지원 이력을 확인합니다.",
    badge: null,
    items: ["개인 조건", "가구 조건", "지원 이력"],
  },
  {
    n: 2,
    title: "보러 갈 집을 등록합니다",
    quote: "후보 집의 조건을 함께",
    body: "지역·보증금·월세·전입 가능 여부처럼 지원에 영향을 주는 집 조건을 기록합니다.",
    badge: null,
    items: ["지역", "주거 비용", "전입 가능 여부"],
  },
  {
    n: 3,
    title: "지원 가능성을 확인합니다",
    quote: "확정이 아닌 판단의 단서로",
    body: "신청 가능성이 있거나 추가 확인이 필요한 지원, 현재 조건에서는 어려울 가능성이 있는 지원을 구분합니다.",
    badge: "첫 번째 핵심 검증",
    items: ["신청 가능성 있음", "추가 확인 필요", "어려울 가능성"],
  },
  {
    n: 4,
    title: "질문과 증빙을 준비합니다",
    quote: "다음 행동을 놓치지 않도록",
    body: "중개인과 공식 기관에 확인할 질문, 신청 시기와 보관해야 할 계약서·영수증을 정리합니다.",
    badge: null,
    items: ["확인 질문", "신청 일정", "증빙 보관"],
  },
] as const;

export function StickyJourney() {
  const [active, setActive] = useState(3);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    const steps = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    const ratios = new Map<number, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const n = Number(entry.target.getAttribute("data-step"));
          ratios.set(n, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let next = 0;
        let best = 0;
        ratios.forEach((ratio, n) => {
          if (ratio > best) {
            best = ratio;
            next = n;
          }
        });
        if (!next) return;
        setActive(next);
        trackOnce(`step:${next}`, "step_view", { target: next });
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -30% 0px" }
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section moments" id="moments" aria-labelledby="moments-title">
      <div className="shell">
        <header className="section-title reveal">
          <p className="eyebrow">자취선배의 첫 번째 흐름</p>
          <h2 id="moments-title">
            마음에 드는 집을 발견했다면,
            <br />
            계약하기 전에 확인합니다
          </h2>
        </header>

        <ol className="moments__grid" ref={listRef}>
          {MOMENTS.map((moment) => (
            <li
              className={`moment-card${active === moment.n ? " is-active" : ""}`}
              key={moment.n}
              data-step={moment.n}
            >
              <div className="moment-card__top">
                <span className="num">0{moment.n}</span>
                {moment.badge && <span className="moment-card__badge">{moment.badge}</span>}
              </div>
              <h3>{moment.title}</h3>
              <p className="moment-card__quote">{moment.quote}</p>
              <p>{moment.body}</p>
              <ul className="moment-card__items" aria-label={`${moment.title} 주요 기능`}>
                {moment.items.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
