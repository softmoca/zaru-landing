import { revealDelay } from "../lib/style";

const PLAN = [
  { n: "01", title: "구글폼", body: "첫 집 구경과 입주 경험에서 무엇을 놓쳤는지 확인합니다." },
  { n: "02", title: "인터뷰", body: "구체적인 손해와 기존 해결 행동을 깊게 듣습니다." },
  { n: "03", title: "현장 테스트", body: "실제로 방을 보러 가는 사람에게 작은 가이드를 제공합니다." },
  { n: "04", title: "기능 개발", body: "현장에서 반복적으로 사용된 행동만 제품으로 만듭니다." },
];

const CYCLE = ["가설", "실제 사용자", "행동 관찰", "판단", "개발"];

export function ValidationPlan() {
  return (
    <section className="section validation" aria-labelledby="validation-title">
      <div className="shell">
        <header className="section-title section-title--center reveal">
          <p className="eyebrow">정답보다 빠른 학습</p>
          <h2 id="validation-title">
            먼저 묻고, 실제 행동을 보고,
            <br />
            확인된 것만 만듭니다
          </h2>
        </header>

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
