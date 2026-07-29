import { revealDelay } from "../lib/style";

const STEPS = [
  {
    mark: "①",
    title: "보러 갈 방을 등록합니다",
    body: "가격·위치·건물 유형 등 기본 조건을 기록합니다.",
  },
  {
    mark: "②",
    title: "현장에서 하나씩 확인합니다",
    body: "수압·곰팡이·채광·소음·옵션·관리비를 순서대로 확인합니다.",
  },
  {
    mark: "③",
    title: "사진과 메모를 남깁니다",
    body: "기억에 의존하지 않고 방마다 상태와 확인하지 못한 항목을 기록합니다.",
  },
  {
    mark: "④",
    title: "같은 기준으로 비교합니다",
    body: "여러 방을 비교하고 중개인에게 다시 물어볼 질문을 확인합니다.",
  },
];

const CHECKS = [
  { label: "수압", state: "확인 완료", done: true },
  { label: "곰팡이", state: "사진 2장", done: true },
  { label: "소음", state: "저녁에 재확인", done: false },
];

export function Scenario() {
  return (
    <section className="section scenario" id="scenario" aria-labelledby="scenario-title">
      <div className="shell scenario__layout">
        <div>
          <header className="section-title reveal">
            <p className="eyebrow">첫 번째 검증 · 집 보러 가는 날</p>
            <h2 id="scenario-title">
              방을 보는 짧은 순간에도
              <br />
              확인해야 할 것은 많습니다
            </h2>
          </header>

          <ol className="scenario__steps">
            {STEPS.map((step, index) => (
              <li className="scenario-step reveal" key={step.mark} style={revealDelay(index * 90)}>
                <span className="scenario-step__mark">{step.mark}</span>
                <span>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="check-card reveal" style={revealDelay(160)}>
          <div className="check-card__head">
            <span>
              <small>성수동 원룸 A</small>
              <strong>현장 체크 기록</strong>
            </span>
            <span className="check-card__count">3 / 6</span>
          </div>
          <ul>
            {CHECKS.map((check) => (
              <li key={check.label}>
                <span className={check.done ? "is-done" : ""}>{check.done ? "✓" : "!"}</span>
                <span>
                  <strong>{check.label}</strong>
                  <small>{check.state}</small>
                </span>
              </li>
            ))}
          </ul>
          <div className="check-card__memo">
            <span aria-hidden="true">▧</span>
            <p><strong>중개인에게 다시 묻기</strong><br />관리비 포함 항목, 곰팡이 수리 가능 여부</p>
          </div>
        </div>
      </div>

      <div className="shell">
        <p className="scenario__punch reveal">
          성공 기준은 앱을 열어본 것이 아니라,
          <strong> 기록을 통해 질문이나 계약 판단이 달라지는 것</strong>입니다.
        </p>
      </div>
    </section>
  );
}
