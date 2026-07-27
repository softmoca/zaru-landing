/* [5]-01 홈케어 주기 관리 — 카테고리 주기 리스트 화면 (플레이스홀더) */

const ITEMS = [
  { category: "욕실", task: "배수구 청소", last: "23일 전", due: "오늘", now: true },
  { category: "세탁", task: "이불 빨래", last: "18일 전", due: "3일 뒤", now: false },
  { category: "냉방", task: "에어컨 필터", last: "41일 전", due: "다음 주", now: false },
  { category: "쓰레기", task: "분리수거", last: "5일 전", due: "2일 뒤", now: false },
];

export function ScreenRoutine() {
  return (
    <div className="scr">
      <div className="scr__bar">
        <span className="scr__brand">자루</span>
        <span className="scr__date">7월 넷째 주</span>
      </div>

      <p className="scr__title">오늘 챙길 일</p>

      <ul className="scr__list">
        {ITEMS.map((item) => (
          <li
            key={item.task}
            className={`scr__row${item.now ? " scr__row--now" : ""}`}
          >
            <span className="scr__check" />
            <span className="scr__texts">
              <span className="scr__label">{item.category}</span>
              <span className="scr__task">{item.task}</span>
              <span className="scr__meta">마지막 {item.last}</span>
            </span>
            <span className="scr__due">{item.due}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
