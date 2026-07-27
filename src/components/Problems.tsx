import { order, revealDelay } from "../lib/style";

/* [3] 문제 3카드 — 0/120/240ms 스태거.
   하단 띠는 좌→우 순차 점등, 마지막 "포기한다"만 회색으로 남긴다. */

const CARDS = [
  {
    n: "01",
    title: "기준도 주기도 없다",
    body: "욕실은 몇 주마다, 침구는 언제 빨아야 할까요? 기준이 없으면 자꾸만 미루게 됩니다.",
  },
  {
    n: "02",
    title: "정보는 많은데 '내 답'이 없다",
    body: "검색 결과는 넘칩니다. 수많은 용품과 유행하는 업체까지 — 청소보다 제품 찾는 시간이 여가를 잡아먹습니다.",
  },
  {
    n: "03",
    title: "놓치면 부채처럼 쌓인다",
    body: "바닥 쓸기, 빨래, 쓰레기 처리… 하나둘 놓치면 끝없이 쌓여, 아까운 주말 내내 청소만 하게 됩니다.",
  },
];

const CHAIN = ["미룬다", "주기 감각이 흐려진다", "결국 포기한다"];

export function Problems() {
  return (
    <section className="section problems" aria-labelledby="problems-title">
      <div className="shell">
        <header className="section-title reveal">
          <h2 id="problems-title">자취 살림은, 유지가 어렵다</h2>
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
            </li>
          ))}
        </ol>

        <ol className="chain reveal" aria-label="밀리는 과정">
          {CHAIN.map((step, i) => (
            <li key={step} className="chain__item" style={order(i)}>
              {i > 0 && (
                <span className="chain__arrow" aria-hidden="true">
                  →
                </span>
              )}
              <span
                className={`chain__text${
                  i === CHAIN.length - 1 ? " chain__text--muted" : ""
                }`}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
