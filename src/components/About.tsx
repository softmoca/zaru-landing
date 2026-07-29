import { useInView } from "../hooks/useInView";
import { ZaruMark } from "./ZaruMark";

const FLOW = ["알려준다", "확인한다", "기록한다", "다음 행동으로 이어진다"];

export function About() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.35 });

  return (
    <section
      className={`section about${inView ? " is-lit" : ""}`}
      ref={ref}
      aria-labelledby="about-title"
    >
      <div className="shell about__inner">
        <p className="eyebrow">먼저 살아본 선배처럼</p>

        <h2 className="about__name" id="about-title">
          <ZaruMark size={52} className="about__mark" />
          자취선배
        </h2>

        <p className="lead about__desc">
          자취선배는 현재 자취 단계에 맞춰 확인할 것과 해야 할 일을 알려주고,
          그 결과를 기록해 다음 순간까지 이어주는 서비스입니다.
        </p>

        <div className="about__context">
          <p>
            <span>방향 전환</span>
            루틴을 대신 기억하는 서비스에서, 처음 겪는 순간의 다음 행동을 돕는
            방향으로 바꿨습니다.
          </p>
          <p>
            <span>자취선배의 자리</span>
            방을 찾는 곳과 신청하는 곳 사이에서, 지금 무엇을 확인·판단·기록할지
            안내합니다.
          </p>
        </div>

        <ol className="about__flow" aria-label="자취선배의 핵심 흐름">
          {FLOW.map((item, index) => (
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
