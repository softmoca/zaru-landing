export function Preorder() {
  return (
    <section className="section team-cta" id="team" aria-labelledby="team-title">
      <div className="shell team-cta__card">
        <div className="team-cta__copy">
          <p className="eyebrow">함께 검증하고 싶은 문제</p>
          <h2 id="team-title">
            정보가 아니라
            <br />
            계약 전 판단을 돕고 싶습니다
          </h2>
          <p className="lead">
            첫 자취생이 집을 계약한 뒤 후회하지 않도록, 실제 사용자와
            지원금·집 보기 문제부터 빠르게 검증할 팀을 찾고 있습니다.
          </p>
        </div>

        <div className="team-cta__bottom" id="team-message">
          <p>
            이 방향이 궁금하다면, 모카에게 편하게 말 걸어주세요.
          </p>
          <a className="btn btn--light" href="#team-message">
            같이 이야기하기
          </a>
        </div>
      </div>
    </section>
  );
}
