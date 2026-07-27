import { revealDelay } from "../lib/style";

/* [6] 시나리오 — 알림 3비트.
   가로 3칸 시퀀스. 스티키는 [5]에서 이미 썼으니 여기선 쓰지 않는다.
   각 240ms 시차 + 사이 화살표 순차 점등. */

const BEATS = [
  { mark: "①", text: '알림 도착 — "이번 주엔 욕실만 챙겨도 좋아요"' },
  { mark: "②", text: "앱을 열면 오늘 할 일이 정렬돼 있고" },
  { mark: "③", text: "완료를 누르면, 다음 주기가 자동으로 잡힙니다" },
];

export function Scenario() {
  return (
    <section className="section scenario" aria-labelledby="scenario-title">
      <div className="shell">
        <header className="section-title reveal">
          <p className="eyebrow">시나리오 · 어느 하루</p>
          <h2 id="scenario-title">
            알림 하나로
            <br />
            오늘 챙길 일이 정리된다
          </h2>
        </header>

        <ol className="beats">
          {BEATS.map((beat, i) => (
            <li key={beat.mark} className="beats__item">
              {i > 0 && (
                <span
                  className="beats__arrow reveal"
                  style={revealDelay(i * 240 - 80)}
                  aria-hidden="true"
                >
                  →
                </span>
              )}
              <article className="beat reveal" style={revealDelay(i * 240)}>
                <p className="beat__mark" aria-hidden="true">
                  {beat.mark}
                </p>
                <p className="beat__text">{beat.text}</p>
              </article>
            </li>
          ))}
        </ol>

        <p className="scenario__note reveal" style={revealDelay(240)}>
          지적이 아닌, 기억을 돕는 리마인드 톤.
        </p>
      </div>
    </section>
  );
}
