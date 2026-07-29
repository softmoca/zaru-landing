import { revealDelay } from "../lib/style";

const PLAN = [
  { n: "01", title: "구글폼", body: "첫 자취에서 지원 조건을 언제 알았고 무엇을 놓쳤는지 확인합니다." },
  { n: "02", title: "경험 인터뷰", body: "집 선택과 지원 판단이 연결됐던 구체적인 순간을 깊게 듣습니다." },
  { n: "03", title: "수동 확인", body: "실제 후보 집으로 조건을 함께 확인하고 판단 변화를 관찰합니다." },
  { n: "04", title: "반복 과정 개발", body: "여러 사용자에게 반복해서 필요했던 확인과 기록만 제품으로 만듭니다." },
];

const CYCLE = ["구글폼", "경험 인터뷰", "수동 확인", "판단 변화 관찰", "반복 과정만 개발"];

const HYPOTHESES = [
  {
    label: "문제 가설",
    text: "첫 자취생은 지원금 조건을 계약 후에 알게 되어, 받을 수 있었던 지원을 놓치거나 집 선택을 후회합니다.",
  },
  {
    label: "행동 가설",
    text: "사용자는 계약 전에 자신의 조건과 후보 집의 조건을 입력해 지원 가능성을 확인할 것입니다.",
  },
  {
    label: "가치 가설",
    text: "확인 결과는 후보 집 비교, 중개인에게 할 질문 또는 계약 판단에 영향을 줄 것입니다.",
  },
];

export function ValidationPlan() {
  return (
    <section className="section validation" aria-labelledby="validation-title">
      <div className="shell">
        <header className="section-title section-title--center reveal">
          <p className="eyebrow">계약 전 판단을 검증합니다</p>
          <h2 id="validation-title">
            지원금을 찾았는지가 아니라,
            <br />
            판단이 달라졌는지를 봅니다
          </h2>
        </header>

        <div className="hypothesis-grid">
          {HYPOTHESES.map((item) => (
            <article className="hypothesis-card reveal" key={item.label}>
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <ol className="validation__cards">
          {PLAN.map((item, index) => (
            <li className="validation-card reveal" key={item.n} style={revealDelay(index * 100)}>
              <span className="num">{item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>

        <ol className="validation__cycle reveal" aria-label="검증 흐름">
          {CYCLE.map((item, index) => (
            <li key={item}>
              {index > 0 && <span aria-hidden="true">→</span>}
              <strong>{item}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
