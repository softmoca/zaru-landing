import { revealDelay } from "../lib/style";

const RECORD_FLOW = [
  "방을 보며 하자 촬영",
  "계약 전 수리 여부 확인",
  "입주 당시 상태 재확인",
  "생활 중 문제 발생 시 집주인에게 전달",
  "퇴실할 때 기존 상태의 근거로 활용",
];

export function LoopSection() {
  return (
    <section className="section record-loop" id="record" aria-labelledby="record-title">
      <div className="shell">
        <header className="section-title section-title--center reveal">
          <p className="eyebrow">기록의 연결</p>
          <h2 id="record-title">
            한 번의 기록이
            <br />
            다음 자취 순간의 근거가 됩니다
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
          자취선배는 정보를 모아두는 서비스가 아니라,
          <strong> 이전 순간의 기록을 다음 판단에 활용하는 서비스</strong>입니다.
        </p>
      </div>
    </section>
  );
}
