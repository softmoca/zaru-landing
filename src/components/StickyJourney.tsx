import { useEffect, useRef, useState } from "react";
import { trackOnce } from "../lib/analytics";
import { PhoneFrame } from "./mockups/PhoneFrame";
import { MOCKUPS } from "./mockups/mockups";

/* [5] 핵심 기능 4축 — ★ 스티키 저니 (이 페이지의 메인 이벤트)

   좌측 비주얼이 sticky 로 고정된 채, 우측 4스텝이 지나갈 때마다 화면이 바뀐다.
   IntersectionObserver 로 "지금 화면 밴드를 가장 많이 차지한 스텝"을 골라
   비주얼의 data-active-step 을 갱신한다.

   순서 주의: 정보 조립소는 03(덤 위치). 폰 목업 대신 정적 카드로 톤을 낮춘다. */

const STEPS = [
  {
    n: 1,
    title: "홈케어 주기 관리",
    body: "욕실 · 세탁 · 쓰레기 같은 카테고리로 마지막 완료일과 다음 관리 시점을 확인합니다. 주기가 돌아오면 자루가 알림으로 알려드려요.",
  },
  {
    n: 2,
    title: "자루 픽",
    body: "상황과 소재에 맞는 용품과 서비스를 한곳에서 비교합니다. 직접 할지, 용품을 살지, 서비스에 맡길지 — 선택의 폭이 넓어집니다.",
  },
  {
    n: 3,
    title: "자취 정보 조립소",
    body: "물때는 어떻게 없애지? 지원금은 어디까지 받지? 흩어진 자취 정보를 한 장으로 조립해 드립니다. 검색 대신, 정리된 답을 확인하세요.",
  },
  {
    n: 4,
    title: "마이",
    body: "도움이 된 팁과 완료한 집안일 기록을 저장하고, 다음에 필요할 때 다시 꺼내봅니다.",
  },
] as const;

const FLOW = [
  "앱을 연다",
  "오늘 챙길 일을 본다",
  "완료를 기록한다",
  "필요할 때 답을 찾는다",
];

export function StickyJourney() {
  const [active, setActive] = useState(1);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;

    const steps = Array.from(
      list.querySelectorAll<HTMLElement>("[data-step]")
    );

    // 스텝별 교차 비율을 들고 있다가 가장 큰 쪽을 활성으로 삼는다.
    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const n = Number(entry.target.getAttribute("data-step"));
          ratios.set(n, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let best = 0;
        let bestRatio = 0;
        ratios.forEach((ratio, n) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = n;
          }
        });
        // 밴드에 걸린 스텝이 하나도 없으면 마지막 활성 스텝을 유지한다.
        if (!best) return;
        setActive(best);
        // 실제로 그 스텝에 도달했을 때만 기록한다 (마운트 시점의 기본값은 제외)
        trackOnce(`step:${best}`, "step_view", { target: best });
      },
      { threshold: [0.25, 0.45, 0.65], rootMargin: "-25% 0px -35% 0px" }
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section journey" id="features" aria-labelledby="journey-title">
      <div className="shell">
        <header className="section-title reveal">
          <h2 id="journey-title">자루의 네 가지 축</h2>
        </header>

        <div className="journey__grid">
          <div className="journey__visual" data-active-step={active}>
            <div className="journey__screen" data-step="1">
              <PhoneFrame {...MOCKUPS.home} />
            </div>
            <div className="journey__screen" data-step="2">
              <PhoneFrame {...MOCKUPS.supplies} />
            </div>
            <div className="journey__screen" data-step="3">
              <PhoneFrame {...MOCKUPS.assembly} />
            </div>
            <div className="journey__screen" data-step="4">
              <PhoneFrame {...MOCKUPS.my} />
            </div>
          </div>

          <ol className="journey__steps" ref={listRef}>
            {STEPS.map((step) => (
              <li
                key={step.n}
                className={`journey__step${
                  active === step.n ? " is-active" : ""
                }`}
                data-step={step.n}
                aria-current={active === step.n ? "step" : undefined}
              >
                <p className="journey__step-num num">
                  {String(step.n).padStart(2, "0")}
                </p>
                <h3 className="journey__step-title">{step.title}</h3>
                <p className="journey__step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <ol className="flowline reveal" aria-label="자루를 쓰는 흐름">
          {FLOW.map((item, i) => (
            <li key={item} className="flowline__item">
              {i > 0 && (
                <span className="flowline__arrow" aria-hidden="true">
                  →
                </span>
              )}
              <span className="flowline__text">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
