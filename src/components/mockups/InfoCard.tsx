/* [5]-03 자취 정보 조립소 — 목업 대신 "정적 정보 카드 1장".
   1차 아이템이었던 정보 조립은 이제 덤 위치라, 톤을 한 단계 낮춰 보여준다.
   (폰 프레임 없음 · 채도 낮은 베이지 카드 · 모션 없음) */

const LINES = [
  "물때는 구연산 → 30분 → 마른 걸레",
  "곰팡이는 환기가 8할, 제거제는 그 다음",
  "청년 지원금은 순차 수급이 가능합니다",
];

export function InfoCard() {
  return (
    <article className="infocard">
      <p className="infocard__label">정보 카드</p>
      <h4 className="infocard__title">흩어진 자취 정보, 한 장으로</h4>
      <ul className="infocard__lines">
        {LINES.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="infocard__foot">검색 대신, 정리된 답</p>
    </article>
  );
}
