import { revealDelay } from "../lib/style";

const STEPS = [
  {
    mark: "①",
    title: "나에게 가능한 지원 확인",
    body: "나와 가구, 지역과 과거 수혜 이력으로 알아볼 지원을 좁힙니다.",
  },
  {
    mark: "②",
    title: "후보 집의 지원 조건 확인",
    body: "보증금·월세·전입 가능 여부처럼 지원에 영향을 주는 조건을 봅니다.",
  },
  {
    mark: "③",
    title: "현장에서 집 상태와 조건 기록",
    body: "집의 실제 상태와 확인하지 못한 조건을 사진과 메모로 남깁니다.",
  },
  {
    mark: "④",
    title: "여러 방 비교와 계약 판단",
    body: "지원 가능성, 집 상태, 다시 물어볼 질문을 같은 기준으로 비교합니다.",
  },
  {
    mark: "⑤",
    title: "입주 준비와 증빙 보관",
    body: "계약서·중개수수료·이사비 영수증과 신청 일정을 다음 순간으로 이어갑니다.",
  },
];

const CHECKS = [
  { label: "전입신고", state: "중개인에게 추가 확인", done: false },
  { label: "보증금·월세", state: "후보 집 조건 기록", done: true },
  { label: "신청 시기", state: "공고 일정 확인 필요", done: false },
];

export function Scenario() {
  return (
    <section className="section scenario" id="scenario" aria-labelledby="scenario-title">
      <div className="shell scenario__layout">
        <div>
          <header className="section-title reveal">
            <p className="eyebrow">지원금과 집 보러 가기의 연결</p>
            <h2 id="scenario-title">
              지원금과 집 보기는
              <br />
              따로 떨어진 문제가 아닙니다
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
              <small>후보 집 A · 계약 전</small>
              <strong>지원 조건 확인</strong>
            </span>
            <span className="check-card__count">추가 확인</span>
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
            <p><strong>다음 질문 준비</strong><br />전입신고 가능 여부와 계약서 특약 확인</p>
          </div>
        </div>
      </div>

      <div className="shell">
        <p className="scenario__punch reveal">
          지원금 목록을 본 것으로 끝나지 않고,
          <strong> 후보 집 비교나 중개인에게 할 질문, 계약 판단이 달라지는지</strong>
          확인합니다.
        </p>
      </div>
    </section>
  );
}
