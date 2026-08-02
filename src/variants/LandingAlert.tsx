import { useEffect, useMemo, useState } from "react";
import { ZaruMark } from "../components/ZaruMark";
import { track, trackOnce } from "../lib/analytics";
import "../styles/landing-alert.css";

const INSTAGRAM_DM_URL = "https://www.instagram.com/direct/inbox/";
const DM_REQUEST = "자취선배 손해 방지 체크리스트를 받고 싶어요.";

const alerts = [
  {
    id: "support",
    code: "LOSS 01",
    amount: "최대 480만 원",
    title: "전입신고 불가를 월세 할인과 바꾸는 경우",
    body: "지원 조건과 임차인의 권리 보호에 필요한 확인을 놓칠 수 있습니다.",
    ask: "전입신고와 확정일자가 가능한가요?",
  },
  {
    id: "fixed-cost",
    code: "LOSS 02",
    amount: "2년 120만 원",
    title: "관리비 밖 별도 비용이 매달 5만 원인 경우",
    body: "수도·인터넷·주차·공용 전기까지 합친 총주거비로 비교해야 합니다.",
    ask: "관리비에 포함되지 않는 항목은 무엇인가요?",
  },
  {
    id: "deposit",
    code: "LOSS 03",
    amount: "보증금 전액",
    title: "근저당·압류·선순위 보증금을 확인하지 않은 경우",
    body: "사진과 내부 상태가 좋아도 보증금 회수 위험은 등기와 권리관계에 남습니다.",
    ask: "오늘 발급한 등기부와 선순위 보증금을 볼 수 있나요?",
  },
  {
    id: "defect",
    code: "LOSS 04",
    amount: "첫 장마 이후",
    title: "최상층 새 벽지를 깨끗한 방으로만 본 경우",
    body: "옥상 방수, 천장 얼룩, 외벽 모서리와 가구 뒤 보수 이력을 함께 봐야 합니다.",
    ask: "최근 누수·결로 보수와 도배를 한 이유가 있나요?",
  },
] as const;

const quickChecks = [
  "전입신고·확정일자 가능 여부를 물었다",
  "관리비 밖 별도 비용을 전부 적었다",
  "오늘 발급한 등기부를 확인했다",
  "천장·창틀·가구 뒤 얼룩을 봤다",
] as const;

export function LandingAlert() {
  const [checked, setChecked] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackOnce("view:variant-2", "view", { target: "landing-alert" });
  }, []);

  const exposure = useMemo(() => {
    if (checked.length === 0) return "아직 계산 전";
    if (checked.length === quickChecks.length) return "확인 완료";
    return `${quickChecks.length - checked.length}개 위험 남음`;
  }, [checked]);

  const toggleCheck = (index: number) => {
    setChecked((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    );
    void track("checklist_interaction", {
      target: `alert-${index + 1}`,
      payload: { variant: 2 },
    });
  };

  const copyDm = async () => {
    try {
      await navigator.clipboard.writeText(DM_REQUEST);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
    void track("checklist_cta_click", { target: "copy-dm", payload: { variant: 2 } });
  };

  return (
    <div className="alert-page">
      <header className="alert-nav">
        <a className="alert-brand" href="#top" aria-label="자취선배 홈">
          <ZaruMark size={24} />
          <b>자취선배</b>
        </a>
        <span>ROOM LOSS REPORT · 2026</span>
        <a href="#receive">체크리스트 받기</a>
      </header>

      <main id="top">
        <section className="alert-hero">
          <div className="alert-ticker" aria-hidden="true">
            <span>싸다는 말 뒤의 비용을 확인하세요</span>
            <span>싸다는 말 뒤의 비용을 확인하세요</span>
          </div>

          <div className="alert-hero__grid">
            <div className="alert-hero__copy">
              <p className="alert-eyebrow"><i /> 계약 전 손실 경보</p>
              <h1>
                월세 <strong>−5만 원</strong>에 끌려
                <br />
                <mark>최대 480만 원</mark>을
                <br />
                놓치지 마세요.
              </h1>
              <p className="alert-hero__description">
                싸게 나온 이유를 묻지 않으면 할인보다 큰 비용이 계약 뒤에 나타납니다.
                지원 조건부터 보증금, 관리비, 누수까지 현장에서 확인하세요.
              </p>
              <div className="alert-hero__actions">
                <a className="alert-button" href="#test">내 방 위험 확인하기</a>
                <span>24개 전체 항목 중 4개 미리보기 ↓</span>
              </div>
            </div>

            <div className="alert-bill" aria-label="후보 매물 손실 고지서 예시">
              <div className="alert-bill__head">
                <span>후보 매물 A</span>
                <b>손실 고지서</b>
              </div>
              <div className="alert-bill__price">
                <small>광고에서 보인 절약</small>
                <strong>− 5만 원</strong>
                <span>/ 월</span>
              </div>
              <ul>
                <li><span>전입신고</span><b>확인 전</b></li>
                <li><span>별도 관리비</span><b>+ 5만 원</b></li>
                <li><span>보증금 권리</span><b>확인 전</b></li>
                <li><span>옥상 방수 이력</span><b>확인 전</b></li>
              </ul>
              <div className="alert-bill__stamp">계약 보류</div>
              <p>싼 방이 아니라, 아직 계산이 끝나지 않은 방입니다.</p>
            </div>
          </div>

          <div className="alert-alliance">
            <span>임대인은 집을 내놓습니다.</span>
            <span>공인중개사는 계약을 중개합니다.</span>
            <strong>자취선배는 계약 뒤 내 통장을 지킵니다.</strong>
          </div>
        </section>

        <section className="alert-losses" id="losses">
          <div className="alert-section-head">
            <p>DON'T SIGN BEFORE YOU ASK</p>
            <h2>계약서에 사인하기 전,<br />이 네 문장은 꼭 물어보세요.</h2>
          </div>
          <div className="alert-loss-grid">
            {alerts.map((item) => (
              <article className="alert-loss-card" key={item.id}>
                <div><span>{item.code}</span><b>{item.amount}</b></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <blockquote>“{item.ask}”</blockquote>
              </article>
            ))}
          </div>
          <p className="alert-disclaimer">
            * 최대 480만 원은 2026 청년월세 지원의 월 최대 20만 원·최대 24개월 기준 예시입니다.
            실제 지원 여부는 모집 시기와 개인·매물 조건에 따라 달라집니다.
          </p>
        </section>

        <section className="alert-test" id="test">
          <div className="alert-test__copy">
            <p>60초 셀프 체크</p>
            <h2>오늘 본 방,<br />계약해도 될까요?</h2>
            <p>“네”라고 답하지 못한 항목은 할인보다 먼저 확인해야 할 질문입니다.</p>
            <div className={`alert-score alert-score--${checked.length}`}>
              <small>현재 상태</small>
              <strong>{exposure}</strong>
              <span>{checked.length} / {quickChecks.length} 확인</span>
            </div>
          </div>
          <div className="alert-checks">
            {quickChecks.map((item, index) => {
              const active = checked.includes(index);
              return (
                <button
                  key={item}
                  className={active ? "is-checked" : ""}
                  type="button"
                  onClick={() => toggleCheck(index)}
                  aria-pressed={active}
                >
                  <span>{active ? "✓" : String(index + 1).padStart(2, "0")}</span>
                  <b>{item}</b>
                </button>
              );
            })}
          </div>
        </section>

        <section className="alert-position">
          <p>WHO IS ON YOUR SIDE?</p>
          <h2>
            계약을 성사시키는 쪽이 한편이라면,
            <br />
            <strong>자취선배는 계약 후를 살아갈 임차인의 편입니다.</strong>
          </h2>
        </section>

        <section className="alert-cta" id="receive">
          <div>
            <p>다음 방을 보기 전에</p>
            <h2>24개 손해 방지<br />체크리스트를 챙기세요.</h2>
          </div>
          <div className="alert-cta__actions">
            <button type="button" onClick={copyDm}>
              {copied ? "DM 문구 복사 완료" : "DM 요청 문구 복사하기"}
            </button>
            <a href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer">
              인스타그램 DM 열기 ↗
            </a>
            <small>실제 계정 확정 후 직접 DM 링크로 교체합니다.</small>
          </div>
        </section>
      </main>

      <footer className="alert-footer">
        <b><ZaruMark size={21} /> 자취선배</b>
        <span>싼 방보다, 돈을 잃지 않을 방.</span>
        <small>© 2026</small>
      </footer>
    </div>
  );
}
