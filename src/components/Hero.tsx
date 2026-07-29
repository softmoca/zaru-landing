import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { revealDelay } from "../lib/style";

const CHIPS = ["지원금", "집 보러 가기", "입주 준비"];

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useScrollProgress<HTMLElement>({
    enabled: !reducedMotion,
  });
  return (
    <section className="hero" id="top" ref={sectionRef} aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />

      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="eyebrow reveal">첫 자취 생활 내비게이터 · 자취선배</p>

          <h1 className="hero__title reveal" id="hero-title" style={revealDelay(80)}>
            처음 방을 보는 날부터,
            <br />
            떠나는 날까지
          </h1>

          <div className="hero__support-question reveal" style={revealDelay(160)}>
            <h2>
              이 집, 계약해도
              <br />
              지원금 받을 수 있을까요?
            </h2>
            <p>
              나의 조건만 보는 것이 아니라 지역·보증금·월세·전입신고 조건까지
              함께 확인해, 계약 전에 알아볼 지원과 준비할 일을 알려드려요.
            </p>
          </div>

          <p className="hero__sub reveal" style={revealDelay(240)}>
            지금 확인할 것, 해야 할 일, 남겨둘 기록을
            <br />
            먼저 살아본 선배처럼 순서대로 알려드릴게요.
          </p>

          <ul className="hero__chips reveal" style={revealDelay(320)}>
            {CHIPS.map((chip) => (
              <li key={chip} className="hero__chip">
                {chip}
              </li>
            ))}
          </ul>

          <div className="hero__actions reveal" style={revealDelay(400)}>
            <a className="btn btn--primary" href="#problem">
              우리가 해결하려는 문제 보기
            </a>
            <p className="hero__note">
              첫 자취생의 실제 경험부터 확인하고, 필요한 것만 작게 만듭니다.
            </p>
          </div>
        </div>

        <div className="hero__visual" aria-label="집을 보며 확인하고 기록하는 과정 예시">
          <div className="navigator-card">
            <div className="navigator-card__top">
              <span className="navigator-card__eyebrow">집 보러 가기 · 2/6</span>
              <span className="navigator-card__status">현장 확인</span>
            </div>
            <div>
              <p className="navigator-card__label">지금 확인할 것</p>
              <h2>창가와 벽 모서리의<br />곰팡이를 확인해요</h2>
            </div>
            <div className="navigator-card__check">
              <span aria-hidden="true">✓</span>
              수압 확인 완료
            </div>
            <div className="navigator-card__record">
              <span className="record-thumb" aria-hidden="true">＋</span>
              <span>
                <strong>사진과 메모 남기기</strong>
                <small>다음 판단에 쓸 근거를 기록해요</small>
              </span>
            </div>
          </div>
          <div className="hero__float hero__float--question" aria-hidden="true">
            <span>?</span>
            <span>
              <b>다시 물어볼 질문</b>
              <em>관리비에 수도 요금 포함?</em>
            </span>
          </div>
          <div className="hero__float hero__float--saved" aria-hidden="true">
            <span>✓</span>
            기록이 저장됐어요
          </div>
        </div>
      </div>
    </section>
  );
}
