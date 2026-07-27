import { revealDelay } from "../lib/style";

/* [2] 공감/문제
   형광 밑줄(scaleX 0→1)은 페이지 전체에서 여기 한 번만 쓴다.
   말풍선 2개는 120ms 시차. */

export function Empathy() {
  return (
    <section className="section empathy" aria-labelledby="empathy-title">
      <div className="shell empathy__inner">
        <h2 className="empathy__q reveal" id="empathy-title">
          마지막으로 <span className="mark">배수구</span>를 청소한 게
          언제였나요?
        </h2>

        <p className="lead empathy__sub reveal" style={revealDelay(120)}>
          이불은 언제 빨았는지, 에어컨 필터는 언제 갈았는지 — 바로
          떠오르시나요?
        </p>

        <div className="empathy__bubbles">
          <blockquote className="bubble reveal">
            <p>
              "이불은 언제 빨았지?
              <br />
              배수구 냄새는 어떻게 없애지?"
            </p>
          </blockquote>

          <p className="bubble bubble--plain reveal" style={revealDelay(120)}>
            정신없이 지내다, 문득 더러워진 방을 발견합니다.
            <br />
            일주일에도 몇 번씩 드는 생각.
          </p>
        </div>

        <p className="empathy__punch reveal" style={revealDelay(160)}>
          한 번 밀린 집안일은,
          <br />
          우리를 계속 괴롭게 만듭니다.
        </p>
      </div>
    </section>
  );
}
