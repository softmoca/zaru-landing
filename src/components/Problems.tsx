import { revealDelay } from "../lib/style";

const CARDS = [
  {
    n: "01",
    title: "집의 조건",
    body: "전입신고 가능 여부와 보증금·월세 기준을 계약 전에 연결해 보기 어려웠습니다.",
    quote: "전입신고가 안 되는 집인지 모르고 계약했습니다.",
  },
  {
    n: "02",
    title: "나와 가구의 조건",
    body: "본인 소득뿐 아니라 부모님 소득과 재산까지 확인한다는 사실을 뒤늦게 알았습니다.",
    quote: "신청하려고 보니 부모님 소득도 확인한다는 걸 알았습니다.",
  },
  {
    n: "03",
    title: "신청 시기와 증빙",
    body: "지원 제도를 늦게 알아 신청 기간과 미리 보관해야 할 증빙자료를 놓쳤습니다.",
    quote: "며칠 차이로 신청 기간이 끝났습니다.",
  },
  {
    n: "04",
    title: "지역·이력·중복 조건",
    body: "지역 이동, 과거 수혜 이력, 사업 간 중복 가능성을 직접 비교하기 어려웠습니다.",
    quote: "월세 기준을 조금 넘어서 대상이 되지 않았습니다.",
  },
];

export function Problems() {
  return (
    <section className="section problems" id="problem" aria-labelledby="problems-title">
      <div className="shell">
        <header className="section-title reveal">
          <p className="eyebrow">첫 자취의 핵심 문제</p>
          <h2 id="problems-title">
            지원금은 있었지만,
            <br />
            알게 된 순간이 늦었습니다
          </h2>
          <p className="lead">
            첫 자취 당시 지원금과 집 선택을 물은 초기 응답 10건에서, 계약 전에
            함께 판단하기 어려웠던 조건이 반복됐습니다.
          </p>
        </header>

        <ol className="problems__cards">
          {CARDS.map((card, i) => (
            <li
              key={card.n}
              className="problem reveal"
              style={revealDelay(i * 120)}
            >
              <p className="problem__num num">{card.n}</p>
              <h3 className="problem__title">{card.title}</h3>
              <p className="problem__body">{card.body}</p>
              <blockquote className="problem__quote">
                “{card.quote}”
                <cite>초기 응답 중 · 익명</cite>
              </blockquote>
            </li>
          ))}
        </ol>

        <p className="problems__punch reveal">
          사용자가 가장 궁금한 것은
          <strong> “이 집을 계약하면 어떤 지원을 알아볼 수 있고, 무엇을 놓치게 될까?”</strong>
          입니다.
        </p>
      </div>
    </section>
  );
}
