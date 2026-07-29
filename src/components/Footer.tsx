import { ZaruMark } from "./ZaruMark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div>
          <p className="footer__brand">
            <ZaruMark size={24} />
            자취선배
          </p>
          <p className="footer__line">
            처음 방을 보는 날부터 떠나는 날까지,
            <br />
            지금 해야 할 일을 알려주는 자취 생활 내비게이터
          </p>
        </div>

        <p className="footer__closing">
          우아한테크코스 팀 빌딩 · 2026
        </p>
      </div>
    </footer>
  );
}
