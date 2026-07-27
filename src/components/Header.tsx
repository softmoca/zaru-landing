import { useEffect, useState } from "react";
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
          자루
          <span className="header__tag">자취 루틴 관리</span>
        </a>
        <a className="btn btn--primary header__cta" href="#preorder">
          사전예약
        </a>
      </div>
    </header>
  );
}
