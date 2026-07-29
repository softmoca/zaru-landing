import { revealDelay } from "../lib/style";

const EVIDENCE_CARDS = [
  {
    title: "집의 조건",
    body: "전입신고 가능 여부와 보증금·월세 기준에 따라 지원 가능성이 달라졌습니다.",
  },
  {
    title: "나와 가구의 조건",
    body: "본인 소득뿐 아니라 부모님 소득·재산 등 예상하지 못한 조건이 있었습니다.",
  },
  {
    title: "신청 시기와 증빙",
    body: "지원 제도를 늦게 알아 신청 기간과 영수증·계약서 같은 자료를 놓쳤습니다.",
  },
  {
    title: "지역과 지원 이력",
    body: "지역마다 제도가 달랐고 과거 수혜·이사·중복 가능 여부를 판단하기 어려웠습니다.",
  },
];

const QUOTES = [
  "전입신고가 안 되는 집인지 모르고 계약했어요.",
  "신청하려고 보니 부모님 소득도 확인한다는 걸 알았어요.",
  "며칠 차이로 신청 기간이 끝났어요.",
  "월세 기준을 조금 넘어서 대상이 되지 않았어요.",
];

const CONDITIONS = ["나의 조건", "후보 집의 조건", "지역·신청 시기·지원 이력"];
const NEXT_FLOW = ["지원금 가능성 확인", "집 보러 가기", "방 비교와 계약", "입주 준비"];

export function SupportEvidence() {
  return (
    <>
      <section className="section evidence" id="support-evidence" aria-labelledby="evidence-title">
        <div className="shell">
          <header className="section-title reveal">
            <p className="eyebrow">초기 사용자 응답</p>
            <h2 id="evidence-title">
              계약하고 나서야
              <br />
              알게 된 것들이 있었습니다
            </h2>
            <p className="lead">
              첫 자취 경험을 물었을 때, 지원금의 존재보다 계약 전에는 판단하기
              어려웠던 조건이 반복해서 등장했습니다.
            </p>
          </header>

          <ol className="evidence__cards">
            {EVIDENCE_CARDS.map((card, index) => (
              <li className="evidence-card reveal" key={card.title} style={revealDelay(index * 90)}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </li>
            ))}
          </ol>

          <div className="evidence__quotes" aria-label="초기 익명 응답">
            {QUOTES.map((quote, index) => (
              <blockquote className="evidence-quote reveal" key={quote} style={revealDelay(index * 70)}>
                <p>“{quote}”</p>
                <cite>초기 응답 중 · 익명</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section support-bridge" aria-labelledby="support-bridge-title">
        <div className="shell">
          <header className="section-title section-title--center reveal">
            <p className="eyebrow">지원금과 집 선택의 연결</p>
            <h2 id="support-bridge-title">
              그래서 지원금 확인과
              <br />
              집 보기는 따로가 아닙니다
            </h2>
            <p className="lead">
              지원금 목록만 보여주는 것으로는 부족합니다. 나의 조건과 후보 집의
              조건을 함께 확인해야 계약 전에 더 나은 판단을 할 수 있습니다.
            </p>
          </header>

          <div className="support-bridge__formula reveal" aria-label="지원금 확인 조건">
            <div className="support-bridge__conditions">
              {CONDITIONS.map((condition, index) => (
                <span key={condition}>
                  {index > 0 && <b aria-hidden="true">＋</b>}
                  <strong>{condition}</strong>
                </span>
              ))}
            </div>
            <span className="support-bridge__arrow" aria-hidden="true">→</span>
            <strong className="support-bridge__result">
              확인할 지원과
              <br />
              다음 행동
            </strong>
          </div>

          <ol className="support-bridge__next reveal" aria-label="이어지는 자취 흐름">
            {NEXT_FLOW.map((item, index) => (
              <li key={item}>
                {index > 0 && <span aria-hidden="true">→</span>}
                <strong>{item}</strong>
              </li>
            ))}
          </ol>

          <p className="support-bridge__notice reveal">
            자취선배는 지원 대상을 확정하지 않습니다. 신청 가능성과 추가로 확인할
            조건을 안내하고 공식 기관으로 연결합니다. 지원 정책은 변경될 수 있으며
            최종 대상 여부는 공식 기관의 심사를 통해 결정됩니다.
          </p>
        </div>
      </section>
    </>
  );
}
