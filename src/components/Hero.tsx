import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { revealDelay } from "../lib/style";

const CHIPS = ["지원금 가능성 확인", "집 보러 가기", "입주 준비"];

const SUPPORT_STATES = [
  { label: "신청 가능성 있음", tone: "possible" },
  { label: "추가 확인 필요", tone: "check" },
  { label: "현재 조건에서는 어려울 가능성", tone: "mismatch" },
] as const;

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
            이 집, 계약해도
            <br />
            지원금 받을 수 있을까요?
          </h1>

          <p className="hero__sub reveal" style={revealDelay(160)}>
            나의 조건만 보는 것이 아니라 지역·보증금·월세·전입신고 조건까지
            함께 확인해, 계약 전에 알아볼 지원과 준비할 일을 알려드려요.
          </p>

          <ul className="hero__chips reveal" style={revealDelay(260)}>
            {CHIPS.map((chip) => (
              <li key={chip} className="hero__chip">
                {chip}
              </li>
            ))}
          </ul>

          <div className="hero__actions reveal" style={revealDelay(340)}>
            <a className="btn btn--primary" href="#problem">
              우리가 먼저 검증할 문제 보기
            </a>
            <p className="hero__note">
              계약하고 나서 알면 늦을 수 있으니까.
            </p>
          </div>
        </div>

        <div className="hero__visual" aria-label="나의 조건과 후보 집 조건으로 지원 가능성을 확인하는 과정 예시">
          <div className="navigator-card support-preview">
            <div className="navigator-card__top">
              <span className="navigator-card__eyebrow">계약 전 확인 · 후보 집</span>
              <span className="navigator-card__status">가능성 안내</span>
            </div>

            <div className="support-preview__inputs">
              <div>
                <span>나의 조건</span>
                <strong>나이 · 소득 · 가구</strong>
              </div>
              <b aria-hidden="true">＋</b>
              <div>
                <span>후보 집 조건</span>
                <strong>지역 · 보증금 · 월세</strong>
              </div>
            </div>

            <div className="support-preview__arrow" aria-hidden="true">↓</div>

            <div className="support-preview__states">
              {SUPPORT_STATES.map((state) => (
                <div className={`support-state support-state--${state.tone}`} key={state.label}>
                  <span aria-hidden="true" />
                  <strong>{state.label}</strong>
                </div>
              ))}
            </div>

            <p className="support-preview__notice">
              지원 정책은 변경될 수 있으며, 최종 대상 여부는 공식 기관의 심사를
              통해 결정됩니다.
            </p>
          </div>
          <div className="hero__float hero__float--question" aria-hidden="true">
            <span>?</span>
            <span><b>추가 확인할 조건</b><em>전입신고 가능 여부</em></span>
          </div>
          <div className="hero__float hero__float--saved" aria-hidden="true">
            <span>✓</span>
            계약 전에 확인해요
          </div>
        </div>
      </div>
    </section>
  );
}
