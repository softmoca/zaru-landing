import { ZaruMark } from "./ZaruMark";

/* [9] 푸터 */

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div>
          <p className="footer__brand">
            <ZaruMark size={24} />
            자루 <span className="footer__divider">|</span> 자취 루틴 관리
          </p>
          <p className="footer__line">
            놓치는 자취 살림, 자루가 대신 기억해요.
          </p>
        </div>

        <p className="footer__closing">
          복잡한 생활을 포근하게 정리해주는 초록색 친구.
        </p>
      </div>
    </footer>
  );
}
