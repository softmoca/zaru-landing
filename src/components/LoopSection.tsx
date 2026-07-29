import { revealDelay } from "../lib/style";

const RECORD_FLOW = [
  "집을 보며 전입 가능 여부 확인",
  "후보 집 정보에 기록",
  "지원 가능성 비교",
  "계약 전 중개인에게 재확인",
  "계약서·영수증 보관과 신청 일정 안내",
];

export function LoopSection() {
  return (
    <section className="section record-loop" id="record" aria-labelledby="record-title">
      <div className="shell">
        <header className="section-title section-title--center reveal">
          <p className="eyebrow">기록의 연결</p>
          <h2 id="record-title">
            계약 전 확인이
            <br />
            신청과 입주 준비까지 이어집니다
          </h2>
        </header>

        <ol className="record-flow">
          {RECORD_FLOW.map((item, index) => (
            <li className="record-flow__item reveal" key={item} style={revealDelay(index * 80)}>
              <span className="record-flow__num">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {index < RECORD_FLOW.length - 1 && <span className="record-flow__arrow" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>

        <p className="record-loop__desc lead reveal">
          자취선배는 정보를 보여주는 데서 끝나지 않고,
          <strong> 확인한 조건과 기록을 다음 판단과 행동에 활용하는 서비스</strong>입니다.
        </p>
      </div>
    </section>
  );
}
