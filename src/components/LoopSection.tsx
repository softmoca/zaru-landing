import { useCallback, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { useInView } from "../hooks/useInView";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { order } from "../lib/style";

/* [7] 다시 루프 — ★ 원형 시퀀스

   재방문이 이 서비스의 핵심 가설이라, 그걸 눈으로 보여주는 자리.
   섹션을 길게(220svh) 잡고 안쪽을 sticky 로 고정한 뒤,
   스크롤 진행률 0→1 을 SVG stroke-dashoffset 에 그대로 물려 원호를 그린다.
   0.25 / 0.5 / 0.75 / 1.0 에서 뱃지가 하나씩 켜지고, 마지막에 원이 닫힌다.

   모바일(<=768px)에서는 원형 대신 세로 타임라인. 스크롤 연동 계산은 아예 끈다. */

const BADGES = ["알림", "완료", "다음 주기", "다시 알림"];
const MONTHLY_DONE = 12;

/** 진행 구간 = 트랙 높이 - 뷰포트 1개. 이 구간을 다 지나면 원이 닫힌다. */
const loopSpan = (el: HTMLElement) =>
  Math.max(1, el.offsetHeight - window.innerHeight);

export function LoopSection() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const scrollDriven = !reducedMotion && !isMobile;

  // 몇 개까지 켜졌는지(0~4). 프레임마다가 아니라 4분면이 바뀔 때만 리렌더된다.
  const [lit, setLit] = useState(0);
  const handleProgress = useCallback((p: number) => {
    const next = p >= 0.98 ? BADGES.length : Math.floor(p / 0.25);
    setLit((prev) => (prev === next ? prev : next));
  }, []);

  const sectionRef = useScrollProgress<HTMLElement>({
    varName: "--loop-progress",
    span: loopSpan,
    onProgress: handleProgress,
    enabled: scrollDriven,
    disabledValue: 1,
  });

  // 세로 타임라인(모바일)과 원 닫힘 연출용
  const [viewRef, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [countRef, countInView] = useInView<HTMLParagraphElement>({
    threshold: 0.55,
  });
  const count = useCountUp(MONTHLY_DONE, countInView, {
    instant: reducedMotion,
  });

  const closed = lit >= BADGES.length;

  return (
    <section
      className={`loop${inView ? " is-drawn" : ""}${closed ? " is-closed" : ""}`}
      id="loop"
      ref={sectionRef}
      aria-labelledby="loop-title"
    >
      <div className="loop__sticky">
        <div className="shell loop__grid" ref={viewRef}>
          <div className="loop__figure">
            <div className="loop__circle">
              <svg className="loop__svg" viewBox="0 0 320 320" aria-hidden="true">
                <circle className="loop__track" cx="160" cy="160" r="150" />
                <circle
                  className="loop__arc"
                  cx="160"
                  cy="160"
                  r="150"
                  pathLength={1}
                />
                <g className="loop__head">
                  <circle cx="160" cy="10" r="7" />
                </g>
              </svg>

              <ol className="loop__badges">
                {BADGES.map((badge, i) => (
                  <li key={badge} className={`loop__slot loop__slot--${i}`}>
                    <span
                      className="loop__badge"
                      data-on={i < lit}
                      style={order(i)}
                    >
                      <span className="loop__badge-num num">{i + 1}</span>
                      {badge}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="loop__copy">
            <p className="eyebrow">다시 루프</p>
            <h2 id="loop-title" className="loop__title">
              다음 주기가 오면,
              <br />
              다시 자루로
            </h2>
            <p className="lead loop__desc">
              완료가 쌓이고 관리 시점이 돌아오면 자루가 다시 알림을 보냅니다.
              놓쳤던 것도, 잘 챙긴 것도 — 주기에 맞춰 다시 이어집니다.
            </p>

            <p className="loop__count" ref={countRef}>
              <span className="visually-hidden">
                이번 달 완료 {MONTHLY_DONE}회
              </span>
              <span aria-hidden="true" className="loop__count-label">
                이번 달 완료
              </span>
              <span aria-hidden="true" className="loop__count-num num">
                {count}
              </span>
              <span aria-hidden="true" className="loop__count-unit">
                회
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
