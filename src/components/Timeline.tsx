const PHASES = [
  "지원금",
  "집 구경",
  "방 비교",
  "계약",
  "입주 준비",
  "초기 정착",
  "생활 문제",
  "관리",
  "재계약·퇴실",
];

export function Timeline() {
  return (
    <section className="section timeline" aria-labelledby="timeline-title">
      <div className="shell">
        <header className="section-title reveal">
          <p className="eyebrow">장기적인 방향</p>
          <h2 id="timeline-title">첫 자취의 전체 사이클을 향합니다</h2>
          <p className="lead">
            전체 사이클을 한꺼번에 만들지는 않습니다. 한 번의 사용자 여정에서는
            지금 처한 한순간의 한 문제만 해결합니다.
          </p>
        </header>

        <ol className="timeline__rail reveal">
          {PHASES.map((phase, index) => (
            <li className={index === 1 ? "is-focus" : ""} key={phase}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{phase}</strong>
            </li>
          ))}
        </ol>

        <p className="timeline__principle reveal">
          <span aria-hidden="true">↗</span>
          한순간을 검증하고, 바로 다음 순간으로 확장합니다.
        </p>
      </div>
    </section>
  );
}
