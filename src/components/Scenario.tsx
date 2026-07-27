import { revealDelay } from "../lib/style";
import { PhoneFrame } from "./mockups/PhoneFrame";
import { MOCKUPS } from "./mockups/mockups";

/* [6] 시나리오 — 알림 3비트 + 관리 팁.
   가로 3칸 시퀀스. 스티키는 [5]에서 이미 썼으니 여기선 쓰지 않는다.
   각 240ms 시차 + 사이 화살표 순차 점등.

   뒤에 붙는 관리 팁 블록은 "몰라서 못 하는 것"을 그 자리에서 푸는 흐름이라
   하루 시나리오의 연장선에 둔다. 캡처 두 장으로 진입(바텀시트) → 도착(조립소)을 보여준다. */

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

        <div className="tipflow">
          <div className="tipflow__copy reveal">
            <p className="eyebrow">관리 팁</p>
            <h3 className="tipflow__title">
              어떻게 하는지 모를 땐,
              <br />
              카드에서 바로
            </h3>
            <p className="lead tipflow__desc">
              카드의 관리 팁을 누르면 그 자리에서 바텀시트가 올라옵니다. 이
              카테고리에 맞게 정리된 답과, 먼저 겪어본 사람들의 꿀팁이 함께
              있어요. 더 보고 싶으면 조립소로 이어집니다.
            </p>
          </div>

          <div className="tipflow__shots">
            <figure className="tipflow__shot reveal" style={revealDelay(120)}>
              <PhoneFrame {...MOCKUPS.tips} />
              <figcaption className="tipflow__caption">
                카드에서 관리 팁 열기
              </figcaption>
            </figure>

            <span
              className="tipflow__arrow reveal"
              style={revealDelay(240)}
              aria-hidden="true"
            >
              →
            </span>

            <figure className="tipflow__shot reveal" style={revealDelay(340)}>
              <PhoneFrame {...MOCKUPS.assembly} />
              <figcaption className="tipflow__caption">
                정리된 답으로 이어지기
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
