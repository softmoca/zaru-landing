import { Fragment, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { revealDelay } from "../lib/style";
import { PhoneFrame } from "./mockups/PhoneFrame";
import { MOCKUPS } from "./mockups/mockups";

/* [1] 히어로
   - 스크롤 진행률 --zaru-progress 를 CSS 변수로 흘려 패럴랙스 (폰 +30px / 좌 -22px / 우 +25px)
   - 서브의 품목 4개는 2.4초 간격으로 하나씩 슬라이드업 강조 (문구는 그대로 둔 채 강조만 이동) */

const ITEMS = ["화장실", "배수구", "이불", "에어컨 필터"];
const CHIPS = ["#화장실", "#배수구", "#이불", "#지원금"];
const ROTATE_MS = 2400;

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useScrollProgress<HTMLElement>({
    enabled: !reducedMotion,
  });
  const [itemIndex, setItemIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(
      () => setItemIndex((i) => (i + 1) % ITEMS.length),
      ROTATE_MS
    );
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <section className="hero" id="top" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />

      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="eyebrow reveal">자취 루틴 관리 · 자루</p>

          <h1 className="hero__title reveal" id="hero-title" style={revealDelay(80)}>
            놓치는 자취 살림,
            <br />
            자루가 대신 기억해요
          </h1>

          <p className="hero__pitch reveal" style={revealDelay(140)}>
            수리비·청소·지원금처럼
            <br />
            <strong>
              몰라서 낭비하는 <span className="hero__accent">시간과 돈</span>도
              줄여드려요.
            </strong>
          </p>

          <p className="hero__sub reveal" style={revealDelay(200)}>
            {ITEMS.map((item, i) => (
              <Fragment key={item}>
                {i > 0 && " · "}
                <span
                  className={`hero__item${itemIndex === i ? " is-on" : ""}`}
                >
                  {item}
                </span>
              </Fragment>
            ))}
            {" — "}
            <br className="hero__br" />
            언제 했는지 기억 안 나는 것들, 자루가 챙겨드릴게요.
          </p>

          <ul className="hero__chips reveal" style={revealDelay(260)}>
            {CHIPS.map((chip) => (
              <li key={chip} className="hero__chip">
                {chip}
              </li>
            ))}
          </ul>

          <div className="hero__actions reveal" style={revealDelay(340)}>
            <a className="btn btn--primary" href="#preorder">
              사전예약하고 먼저 받아보기
            </a>
            <p className="hero__note">
              아직 만드는 중이에요. 출시되면 가장 먼저 알려드릴게요.
            </p>
          </div>
        </div>

        {/* 캡처는 alt 로 읽히고, 주변 카드만 장식이라 따로 숨긴다 */}
        <div className="hero__visual">
          <div className="hero__phone">
            {/* 첫 화면에 바로 보이므로 유일하게 eager */}
            <PhoneFrame {...MOCKUPS.home} priority />
          </div>

          {/* 히어로에서 가장 먼저 읽혀야 하는 카드 — 강조 한 줄의 "지원금"을 받는다 */}
          <div className="hero__card hero__card--left" aria-hidden="true">
            <span className="hero__card-dot" />
            <span>
              <b>월세 지원금 신청</b>
              <em>오늘 알림 도착</em>
            </span>
          </div>

          <div className="hero__card hero__card--right" aria-hidden="true">
            <span className="hero__card-check">✓</span>
            <span>
              <b>이불 빨래</b>
              <em>완료 · 다음은 3주 뒤</em>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
