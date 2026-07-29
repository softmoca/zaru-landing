import { useEffect, useState } from "react";
import { track } from "../lib/analytics";
import { ZaruMark } from "./ZaruMark";

/** 헤더 — scrollY > 20 에서 높이 축소 + 배경 블러 (DESIGN.md 전역) */
export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCompact(window.scrollY > 20);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <header className={`header${compact ? " is-compact" : ""}`}>
      <div className="shell header__inner">
        <a className="header__brand" href="#top">
          <ZaruMark className="header__mark" size={26} />
          자취선배
          <span className="header__tag">첫 자취 생활 내비게이터</span>
        </a>
        <a
          className="btn btn--primary header__cta"
          href="#team-message"
          onClick={() => void track("team_cta_click", { target: "header" })}
        >
          같이 이야기하기
        </a>
      </div>
    </header>
  );
}
