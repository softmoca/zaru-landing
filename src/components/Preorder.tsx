import { track } from "../lib/analytics";

const VALUES = [
  "하나의 문제를 여러 해결책으로 고민합니다.",
  "완성도보다 사용자 반응을 먼저 확인합니다.",
  "주장보다 기록과 데이터를 근거로 대화합니다.",
  "실패하면 원인을 남기고 다음 실험으로 이동합니다.",
];

export function Preorder() {
  function handleClick() {
    void track("team_cta_click");
  }

  return (
    <section className="section team-cta" id="team" aria-labelledby="team-title">
      <div className="shell team-cta__card">
        <div className="team-cta__copy">
          <p className="eyebrow">함께 만들고 싶은 팀</p>
          <h2 id="team-title">완성된 정답을 가져온 것은 아닙니다</h2>
          <p className="lead">
            첫 자취생의 실제 문제를 함께 좁히고, 사용자를 빠르게 만나 가설을
            세우고 깨고 다시 만들 팀을 찾고 있습니다.
          </p>
        </div>

        <ul className="team-cta__values">
          {VALUES.map((value) => <li key={value}><span>✓</span>{value}</li>)}
        </ul>

        <div className="team-cta__bottom" id="team-message">
          <p>
            이 방향이 궁금하다면,
            <br />
            <strong>모카에게 편하게 말 걸어주세요.</strong>
          </p>
          <a className="btn btn--light" href="#team-message" onClick={handleClick}>
            같이 이야기하기
          </a>
        </div>
      </div>
    </section>
  );
}
