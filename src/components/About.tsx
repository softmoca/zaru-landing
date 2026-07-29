import { useInView } from "../hooks/useInView";
const CONDITIONS = [
  { label: "나의 조건", detail: "나이 · 소득 · 가구 조건" },
  { label: "집의 조건", detail: "지역 · 보증금 · 월세 · 전입 가능 여부" },
  { label: "지원 이력", detail: "과거 수혜와 중복 확인" },
  { label: "시간 조건", detail: "신청 기간과 필요한 증빙" },
];

export function About() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.35 });

  return (
    <section
      className={`section about${inView ? " is-lit" : ""}`}
      ref={ref}
      aria-labelledby="about-title"
    >
      <div className="shell about__inner">
        <header className="section-title reveal">
          <p className="eyebrow">계약 전에 함께 확인할 조건</p>
          <h2 id="about-title">
            사람만 확인해서도,
            <br />
            집만 확인해서도 부족합니다
          </h2>
          <p className="lead">
            지원금 이름을 아는 것과 실제 신청 가능성을 판단하는 것은 다릅니다.
            나와 후보 집, 지원 이력과 시간을 한 흐름에서 함께 봐야 합니다.
          </p>
        </header>

        <ol className="condition-grid">
          {CONDITIONS.map((condition, index) => (
            <li className="condition-card reveal" key={condition.label}>
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <strong>{condition.label}</strong>
              <p>{condition.detail}</p>
            </li>
          ))}
        </ol>

        <p className="policy-note reveal">
          자취선배는 지원 대상을 확정하지 않습니다. 신청 가능성과 추가 확인이
          필요한 조건을 안내하고, 최종 확인과 신청은 공식 기관으로 연결합니다.
        </p>
      </div>
    </section>
  );
}
