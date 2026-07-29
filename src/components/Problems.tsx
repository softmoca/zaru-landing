import { revealDelay } from "../lib/style";

/* [3] 문제 3카드 — 0/120/240ms 스태거.
   하단 띠는 좌→우 순차 점등, 마지막 "포기한다"만 회색으로 남긴다. */

const CARDS = [
  {
    n: "01",
    title: "지금 확인할 것을 모릅니다",
    body: "방을 볼 때 수압·곰팡이·소음·관리비 중 무엇을 확인해야 하는지 모릅니다.",
  },
  {
    n: "02",
    title: "놓친 것은 나중에 알게 됩니다",
    body: "계약하거나 입주한 뒤에야 확인하지 못한 문제를 발견합니다.",
  },
  {
    n: "03",
    title: "기록이 다음 순간으로 이어지지 않습니다",
    body: "사진·메모·계약 정보가 흩어져 다음 판단이나 집주인과의 대화에 활용하기 어렵습니다.",
  },
];

export function Problems() {
  return (
    <section className="section problems" id="problem" aria-labelledby="problems-title">
      <div className="shell">
        <header className="section-title reveal">
          <p className="eyebrow">첫 자취의 핵심 문제</p>
          <h2 id="problems-title">
            첫 자취는,
            <br />
            무엇을 모르는지도 모릅니다
          </h2>
          <p className="lead">
            정보는 이미 많습니다. 하지만 지금 무엇을 확인하고, 어떤 행동을 해야
            하는지는 직접 찾아 조립해야 합니다.
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
            </li>
          ))}
        </ol>

        <p className="problems__punch reveal">
          필요한 것은 더 많은 정보가 아니라,
          <strong> 지금 해야 할 다음 행동</strong>입니다.
        </p>
      </div>
    </section>
  );
}
