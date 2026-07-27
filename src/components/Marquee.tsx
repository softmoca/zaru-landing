/* [2.5] 마퀴 띠 — 섹션 사이의 쉼표.
   딥 포레스트 배경 + 올리브 점, rotate(-1.2deg), 20초 무한 루프.
   화면낭독기에는 문구 한 번만 읽히도록 트랙 전체를 aria-hidden 처리한다. */

const PHRASES = ["잊어도 괜찮아요", "자루가 기억하니까"];
const REPEAT = 4;

function Track() {
  return (
    <div className="marquee__track" aria-hidden="true">
      {Array.from({ length: REPEAT }).flatMap((_, r) =>
        PHRASES.map((phrase) => (
          <span className="marquee__item" key={`${r}-${phrase}`}>
            {phrase}
            <span className="marquee__dot" />
          </span>
        ))
      )}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee">
      <p className="visually-hidden">잊어도 괜찮아요 · 자루가 기억하니까</p>
      {/* 두 벌을 이어 붙여 -50% 만큼 흘리면 이음매가 안 보인다 */}
      <div className="marquee__viewport">
        <Track />
        <Track />
      </div>
    </div>
  );
}
