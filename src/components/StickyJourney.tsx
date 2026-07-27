import { useEffect, useRef, useState } from "react";
import { trackOnce } from "../lib/analytics";
import { PhoneFrame } from "./mockups/PhoneFrame";
import { MOCKUPS } from "./mockups/mockups";

/* [5] 핵심 기능 3축 — ★ 스티키 저니 (이 페이지의 메인 이벤트)

   좌측 비주얼이 sticky 로 고정된 채, 우측 3스텝이 지나갈 때마다 화면이 바뀐다.
   IntersectionObserver 로 "지금 화면 밴드를 가장 많이 차지한 스텝"을 골라
   비주얼의 data-active-step 을 갱신한다.

   프로토타입의 하단 탭 3개(홈 / 살림정보 / 마이)를 그대로 따른다.
   예전 "자루 픽"과 "자취 정보 조립소"는 각각 독립 축이 아니라
   살림정보 안의 세그먼트(살림템 / 조립소)가 됐다. */

const STEPS = [
  {
    n: 1,
    title: "오늘 챙길 일",
    body: "욕실 · 세탁 · 쓰레기 같은 카테고리마다 마지막으로 언제 했는지, 다음은 언제인지 보여드려요. 주기가 돌아오면 자루가 알림으로 불러드립니다. 주기 없이 적어만 두고 싶은 건 '적어두기'에 따로 모아둬요.",
    shot: MOCKUPS.home,
  },
  {
    n: 2,
    title: "살림에 필요한 건 여기 다",
    body: "용품과 대행 서비스를 나란히 놓고 고르는 살림템, 흩어진 자취 정보를 한 장으로 모은 조립소. 먼저 겪어본 사람들의 꿀팁과 Q&A까지 한곳에 있습니다.",
    shot: MOCKUPS.supplies,
  },
  {
    n: 3,
    title: "쌓이는 기록",
    body: "완료한 집안일과 저장해 둔 살림템 · 꿀팁이 차곡차곡 쌓입니다. 이번 달 몇 번이나 비워냈는지, 가끔 돌아보세요.",
    shot: MOCKUPS.my,
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
          <h2 id="journey-title">자루의 세 가지 축</h2>
        </header>

        <div className="journey__grid">
          {/* 스텝과 화면은 같은 배열에서 나온다 — 개수가 어긋날 일이 없게 */}
          <div className="journey__visual" data-active-step={active}>
            {STEPS.map((step) => (
              <div className="journey__screen" key={step.n} data-step={step.n}>
                <PhoneFrame {...step.shot} />
              </div>
            ))}
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
