/* [5]-02 자루 픽 — 용품·서비스 비교 카드 화면 (플레이스홀더) */

const TABS = ["직접", "용품", "서비스"];

const PICKS = [
  { name: "배수구 세정 타블렛", note: "월 1회 · 5분", bar: 0.82 },
  { name: "욕실 곰팡이 제거제", note: "분기 1회 · 20분", bar: 0.64 },
  { name: "타일 줄눈 브러시", note: "월 1회 · 15분", bar: 0.55 },
  { name: "출장 청소 서비스", note: "반기 1회 · 2시간", bar: 0.41 },
];

export function ScreenPicks() {
  return (
    <div className="scr">
      <div className="scr__bar">
        <span className="scr__brand">자루 픽</span>
        <span className="scr__date">욕실</span>
      </div>

      <div className="scr__tabs">
        {TABS.map((tab, i) => (
          <span key={tab} className={`scr__tab${i === 1 ? " is-on" : ""}`}>
            {tab}
          </span>
        ))}
      </div>

      <ul className="scr__cards">
        {PICKS.map((pick) => (
          <li key={pick.name} className="scr__card">
            <span className="scr__thumb" />
            <span className="scr__texts">
              <span className="scr__task">{pick.name}</span>
              <span className="scr__meta">{pick.note}</span>
              <span className="scr__gauge">
                <span
                  className="scr__gauge-fill"
                  style={{ transform: `scaleX(${pick.bar})` }}
                />
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="scr__foot">직접 · 용품 · 서비스를 한 화면에서</p>
    </div>
  );
}
