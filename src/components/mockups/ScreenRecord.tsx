/* [5]-04 마이 — 완료 기록 캘린더 (플레이스홀더)
   스텝 04가 활성일 때 도장이 순서대로 찍힌다(CSS 에서 --i 만큼 지연). */

import type { CSSProperties } from "react";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const STAMPED = new Set([2, 5, 8, 9, 13, 16, 19, 20, 23, 26, 27]);
const SAVED_TIPS = ["물때 없애는 순서", "이불 세탁 주기"];

export function ScreenRecord() {
  let stampIndex = 0;

  return (
    <div className="scr">
      <div className="scr__bar">
        <span className="scr__brand">마이</span>
        <span className="scr__date">7월</span>
      </div>

      <p className="scr__title">완료 기록</p>

      <div className="scr__week">
        {WEEKDAYS.map((day) => (
          <span key={day} className="scr__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="scr__cal">
        {DAYS.map((day) => {
          const stamped = STAMPED.has(day);
          const order = stamped ? stampIndex++ : 0;
          return (
            <span
              key={day}
              className={`scr__day${stamped ? " is-stamped" : ""}`}
              style={stamped ? ({ "--i": order } as CSSProperties) : undefined}
            >
              {day}
            </span>
          );
        })}
      </div>

      <p className="scr__title scr__title--sm">저장한 팁</p>

      <ul className="scr__list">
        {SAVED_TIPS.map((tip) => (
          <li key={tip} className="scr__row scr__row--slim">
            <span className="scr__pin" />
            <span className="scr__task">{tip}</span>
          </li>
        ))}
      </ul>

      <p className="scr__foot">
        <span className="scr__foot-num num">11</span>번 완료했어요
      </p>
    </div>
  );
}
