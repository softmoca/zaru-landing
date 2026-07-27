import { useInView } from "../hooks/useInView";
import { ZaruMark } from "./ZaruMark";

/* [4] 자루 소개
   진입하면 배경이 크림 → 화이트로 0.8s 넘어간다.
   인터랙션을 일부러 죽여서 바로 뒤의 [5] 스티키 저니를 받쳐준다. */

export function About() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.35 });

  return (
    <section
      className={`section about${inView ? " is-lit" : ""}`}
      ref={ref}
      aria-labelledby="about-title"
    >
      <div className="shell about__inner">
        <p className="eyebrow">자취 + 루틴 = 자루</p>

        <h2 className="about__name" id="about-title">
          <ZaruMark size={52} className="about__mark" />
          자루
        </h2>

        <p className="about__claim">놓친 주기는, 자루가 대신 기억해요.</p>

        <p className="lead about__desc">
          밀려가는 자취 살림을 제때 비워내고, 정돈된 생활과 내 시간을 다시
          누리게 하는 것 — 이것이 자루의 목표입니다.
        </p>
      </div>
    </section>
  );
}
