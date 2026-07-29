import { useEffect, useRef, useState } from "react";
import { trackOnce } from "../lib/analytics";

const MOMENTS = [
  {
    n: 1,
    title: "지원금 확인",
    quote: "받을 수 있었는데 몰라서 놓치지 않도록",
    body: "내가 확인해볼 지원금과 신청 시기, 필요한 행동을 알려줍니다. 실제 신청은 공식 서비스로 연결합니다.",
    badge: "독립 모듈",
    items: ["조건 확인", "신청 시기", "공식 서비스"],
  },
  {
    n: 2,
    title: "집 보러 가기",
    quote: "좋아 보이는 방보다, 놓치지 않은 방을 고르도록",
    body: "현장에서 확인할 내용을 순서대로 안내하고 사진과 메모를 남깁니다. 여러 방을 같은 기준으로 비교하고, 중개인에게 다시 물어볼 질문을 정리합니다.",
    badge: "첫 번째 핵심 검증",
    items: ["현장 체크", "사진·메모", "같은 기준으로 비교"],
  },
  {
    n: 3,
    title: "입주 준비",
    quote: "계약 이후 무엇부터 해야 할지 막막하지 않도록",
    body: "입주일까지 해야 할 일을 날짜순으로 안내합니다. 행정 처리와 시설 확인, 입주 당시 하자와 계량기 상태도 기록합니다.",
    badge: null,
    items: ["날짜순 할 일", "행정 처리", "입주 상태 기록"],
  },
] as const;

export function StickyJourney() {
  const [active, setActive] = useState(2);
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
          <p className="eyebrow">작게 시작하는 범위</p>
          <h2 id="moments-title">
            자취선배가 먼저 돕는
            <br />
            세 가지 순간
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
