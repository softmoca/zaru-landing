import { useId, useState, type FormEvent } from "react";
import { submitPreorder, track } from "../lib/analytics";

/* [8] 사전예약 CTA — 모달 없이 인라인 입력.
   제출하면 notify 이벤트를 남기고 완료 메시지로 바뀐다.
   Supabase 키가 없으면 콘솔에만 찍고, 사용자에겐 동일하게 완료로 보인다. */

type Status = "idle" | "sending" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL;

export function Preorder() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [kakaoNote, setKakaoNote] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_RE.test(value)) {
      setError("이메일 주소를 다시 확인해 주세요.");
      return;
    }

    setError("");
    setStatus("sending");
    await submitPreorder(value);
    setStatus("done");
  }

  function handleKakao() {
    void track("kakao_click");
    if (!KAKAO_URL) setKakaoNote("카카오톡 채널은 준비 중이에요.");
  }

  return (
    <section className="section preorder" id="preorder" aria-labelledby="preorder-title">
      <div className="shell preorder__inner">
        <h2 className="reveal" id="preorder-title">
          놓치는 자취 살림,
          <br />
          자루가 대신 기억해요
        </h2>

        <p className="lead preorder__sub reveal">
          자루는 아직 만드는 중이에요.
          <br />
          먼저 받아보고 싶다면, 사전예약해 주세요.
        </p>

        {status === "done" ? (
          <p className="preorder__done reveal" role="status">
            사전예약이 접수됐어요. 출시되면 가장 먼저 알려드릴게요.
          </p>
        ) : (
          <form className="preorder__form reveal" onSubmit={handleSubmit} noValidate>
            <label className="visually-hidden" htmlFor={inputId}>
              이메일 주소
            </label>
            <input
              id={inputId}
              className="preorder__input"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${inputId}-error` : undefined}
              disabled={status === "sending"}
            />
            <button
              className="btn btn--primary preorder__submit"
              type="submit"
              disabled={status === "sending"}
            >
              사전예약하기
            </button>
          </form>
        )}

        {error && (
          <p className="preorder__error" id={`${inputId}-error`} role="alert">
            {error}
          </p>
        )}

        <div className="preorder__kakao reveal">
          {KAKAO_URL ? (
            <a
              className="btn btn--ghost"
              href={KAKAO_URL}
              target="_blank"
              rel="noreferrer noopener"
              onClick={handleKakao}
            >
              또는 카카오톡 채널로 알림 받기
            </a>
          ) : (
            <button className="btn btn--ghost" type="button" onClick={handleKakao}>
              또는 카카오톡 채널로 알림 받기
            </button>
          )}
          {kakaoNote && (
            <p className="preorder__note" role="status">
              {kakaoNote}
            </p>
          )}
        </div>

        <p className="preorder__note reveal">
          출시되면 가장 먼저 알려드릴게요. 스팸은 보내지 않아요.
        </p>
      </div>
    </section>
  );
}
