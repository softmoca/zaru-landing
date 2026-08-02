import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "./components/ProgressBar";
import { ZaruMark } from "./components/ZaruMark";
import { useDepthTracking } from "./hooks/useDepthTracking";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useRevealObserver } from "./hooks/useRevealObserver";
import { track, trackOnce } from "./lib/analytics";
import "./styles/august-landing.css";

const INSTAGRAM_DM_URL = "https://www.instagram.com/direct/inbox/";
const DM_REQUEST = "자취선배 집 보기 체크리스트를 받고 싶어요.";

const lossCases = [
  {
    number: "01",
    label: "지원·권리",
    title: "월세 1만 원보다 먼저, 전입신고를 확인하세요.",
    description:
      "전입신고·계약서·월세 납부 기록은 임차인의 권리 보호와 일부 주거지원에서 중요한 확인 조건입니다.",
    amount: "최대 480만 원",
    amountNote: "2026 청년월세 지원 규모 예시",
    question: "“이 방은 전입신고와 확정일자가 가능한가요?”",
    tone: "coral",
  },
  {
    number: "02",
    label: "보증금",
    title: "마음에 드는 방보다, 보증금이 돌아올 방이 먼저입니다.",
    description:
      "등기부의 근저당·압류, 다가구 선순위 보증금, 임대인의 세금 체납은 방 사진만으로 보이지 않습니다.",
    amount: "보증금 전액",
    amountNote: "확인하지 않았을 때의 가장 큰 위험",
    question: "“오늘 발급한 등기부와 선순위 보증금을 볼 수 있나요?”",
    tone: "forest",
  },
  {
    number: "03",
    label: "고정비",
    title: "월세만 싼 방은, 실제로 싼 방이 아닐 수 있습니다.",
    description:
      "정액 관리비와 별도 수도·전기·가스·인터넷·주차비를 합쳐 2년 총주거비로 비교해야 합니다.",
    amount: "2년 120만 원",
    amountNote: "매달 5만 원이 더 들 때의 차이",
    question: "“관리비에 포함되지 않는 항목은 무엇인가요?”",
    tone: "mustard",
  },
  {
    number: "04",
    label: "누수·곰팡이",
    title: "새 벽지는 깨끗함이 아니라, 확인 신호일 수 있습니다.",
    description:
      "최상층 옥상, 외벽 모서리, 창틀과 붙박이장 뒤는 과거 누수·결로 흔적과 보수 이력을 함께 봐야 합니다.",
    amount: "첫 장마 이후",
    amountNote: "계약할 때는 보이지 않을 수 있는 비용",
    question: "“최근 누수·결로 보수와 도배를 한 이유가 있나요?”",
    tone: "sage",
  },
] as const;

const previewChecks = [
  {
    id: "move-in",
    category: "지원·권리",
    title: "전입신고와 확정일자가 가능한가요?",
    note: "불가능하거나 미정이라면 이유와 건축물대장상 용도를 확인합니다.",
  },
  {
    id: "ledger",
    category: "보증금",
    title: "등기부등본과 실제 임대인이 일치하나요?",
    note: "갑구의 소유자와 을구의 근저당·권리관계를 오늘 날짜로 확인합니다.",
  },
  {
    id: "fee",
    category: "고정비",
    title: "관리비 밖에서 매달 빠지는 돈은 무엇인가요?",
    note: "수도·전기·가스·인터넷·주차·청소비의 포함 여부를 적습니다.",
  },
  {
    id: "leak",
    category: "하자",
    title: "천장·외벽·창틀에 물이 지나간 흔적이 있나요?",
    note: "최상층이면 옥상 방수 이력, 외기에 면한 바닥이면 냉기와 결로 흔적을 묻습니다.",
  },
  {
    id: "record",
    category: "퇴실",
    title: "기존 흠집과 옵션 작동 상태를 사진으로 남겼나요?",
    note: "입주 전 사진과 수리 약속을 날짜가 남는 메시지·특약으로 보관합니다.",
  },
] as const;

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const [checked, setChecked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useRevealObserver(!reducedMotion);
  useDepthTracking();

  useEffect(() => {
    trackOnce("view", "view");
  }, []);

  const checkedLabel = useMemo(
    () => `${checked.length} / ${previewChecks.length}`,
    [checked.length]
  );

  const toggleCheck = (id: string) => {
    setChecked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
    void track("checklist_interaction", { target: id });
  };

  const copyDmRequest = async () => {
    try {
      await navigator.clipboard.writeText(DM_REQUEST);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
    void track("checklist_cta_click", { target: "copy_dm" });
  };

  const trackDmOpen = () => {
    void track("checklist_cta_click", { target: "instagram_dm" });
  };

  return (
    <div className="august-page" id="top">
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <ProgressBar />

      <header className="august-header">
        <div className="shell august-header__inner">
          <a className="august-brand" href="#top" aria-label="자취선배 처음으로">
            <ZaruMark size={26} />
            <span>자취선배</span>
            <small>임차인의 집 보기 도구</small>
          </a>
          <a className="august-header__cta" href="#preview">
            5개 먼저 확인하기
          </a>
        </div>
      </header>

      <main id="main">
        <section className="august-hero">
          <div className="august-hero__wash" aria-hidden="true" />
          <div className="shell august-hero__grid">
            <div className="august-hero__copy reveal">
              <p className="august-kicker">집 보는 10분이 · 앞으로의 2년을 만듭니다</p>
              <h1>
                월세가 조금 싼 방보다,
                <br />
                <span>돈을 잃지 않을 방</span>을 고르세요.
              </h1>
              <p className="august-hero__lead">
                지원 조건, 보증금, 관리비, 누수와 곰팡이.
                <br />
                계약 뒤에 알면 늦는 것들을 집을 보는 순간 확인합니다.
              </p>

              <div className="august-side-statement">
                <span aria-hidden="true">→</span>
                <p>
                  <strong>계약을 성사시키는 쪽이 한편이라면,</strong>
                  <br />
                  자취선배는 계약 후를 살아갈 임차인의 편입니다.
                </p>
              </div>

              <div className="august-hero__actions">
                <a className="august-btn august-btn--primary" href="#preview">
                  내 방에서 5개 확인하기
                </a>
                <a className="august-text-link" href="#losses">
                  놓치면 커지는 돈부터 보기 <span>↓</span>
                </a>
              </div>
            </div>

            <div className="august-hero__visual reveal" aria-label="싼 방의 실제 비용 계산 예시">
              <div className="cost-card cost-card--main">
                <div className="cost-card__top">
                  <span>후보 매물 A</span>
                  <b>2년 총비용 다시 계산</b>
                </div>
                <p className="cost-card__address">역에서 5분 · 최상층 원룸</p>
                <div className="cost-card__price">
                  <span>월세</span>
                  <strong>− 5만 원</strong>
                  <small>주변 매물보다 저렴</small>
                </div>
                <div className="cost-card__rows">
                  <p><span>관리비·별도 비용</span><b>+ 5만 원 / 월</b></p>
                  <p><span>전입신고 가능 여부</span><b className="is-warning">확인 전</b></p>
                  <p><span>누수·옥상 방수 이력</span><b className="is-warning">확인 전</b></p>
                  <p><span>보증금 권리관계</span><b className="is-warning">확인 전</b></p>
                </div>
                <div className="cost-card__result">
                  <span>지금 보이는 가격</span>
                  <strong>≠ 실제로 내게 될 돈</strong>
                </div>
              </div>
              <div className="cost-float cost-float--top">
                <small>월 5만 원 차이</small>
                <strong>2년이면 120만 원</strong>
              </div>
              <div className="cost-float cost-float--bottom">
                <small>자취선배의 기준</small>
                <strong>싸 보임보다 손해 없음</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="august-proof-strip" aria-label="자취선배 확인 범위">
          <div className="shell august-proof-strip__inner">
            <p>지원·권리</p>
            <p>보증금</p>
            <p>2년 총주거비</p>
            <p>누수·결로</p>
            <p>입주 증거</p>
          </div>
        </section>

        <section className="august-section august-losses" id="losses">
          <div className="shell">
            <div className="august-section__heading reveal">
              <p className="august-kicker">싼 방의 계산서는 · 나중에 옵니다</p>
              <h2>
                놓치면 커지는 돈부터
                <br />
                먼저 보여드릴게요.
              </h2>
              <p>
                겁을 주기 위한 목록이 아닙니다. 계약 전에 확인하고, 질문하고,
                기록하면 피할 수 있는 손해입니다.
              </p>
            </div>

            <div className="loss-grid">
              {lossCases.map((item) => (
                <article className={`loss-card loss-card--${item.tone} reveal`} key={item.number}>
                  <div className="loss-card__meta">
                    <span>{item.number}</span>
                    <b>{item.label}</b>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="loss-card__description">{item.description}</p>
                  <div className="loss-card__amount">
                    <strong>{item.amount}</strong>
                    <span>{item.amountNote}</span>
                  </div>
                  <p className="loss-card__question">{item.question}</p>
                </article>
              ))}
            </div>

            <p className="august-footnote reveal">
              * ‘최대 480만 원’은 2026년 국토교통부 청년월세 지원의 월 최대 20만 원·최대
              24개월 기준 예시입니다. 2026년 신규 신청은 종료됐으며 실제 지원 여부는 모집 시기와
              개인·매물 조건에 따라 달라집니다.
            </p>
          </div>
        </section>

        <section className="august-section august-viewing">
          <div className="shell august-viewing__layout">
            <div className="august-viewing__copy reveal">
              <p className="august-kicker">사진에 나오지 않는 것들</p>
              <h2>방의 장점은 설명해줍니다. 위험은 내가 물어봐야 합니다.</h2>
              <p>
                넓은 창, 역과의 거리, 새 벽지는 바로 보입니다. 하지만 옥상 방수 이력,
                외벽 결로, 선순위 권리와 관리비의 별도 항목은 먼저 질문하지 않으면 지나치기 쉽습니다.
              </p>
              <div className="august-viewing__quote">
                “좋은 방인가요?”보다
                <br />
                <strong>“이 방에서 내가 잃을 수 있는 돈은 무엇인가요?”</strong>
              </div>
            </div>

            <div className="room-map reveal" aria-label="방에서 확인할 누수와 결로 위치">
              <div className="room-map__roof"><span>최상층</span> 옥상 방수·천장 얼룩</div>
              <div className="room-map__window"><span>창틀</span> 실리콘·결로·외풍</div>
              <div className="room-map__wall"><span>외벽</span> 가구 뒤·모서리 곰팡이</div>
              <div className="room-map__floor"><span>바닥</span> 아래층 주차장·외기 냉기</div>
              <div className="room-map__center">
                <ZaruMark size={32} />
                <b>보이는 방보다</b>
                <strong>살게 될 방을 확인</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="august-section august-preview" id="preview">
          <div className="shell">
            <div className="august-section__heading august-section__heading--center reveal">
              <p className="august-kicker">24개 중 · 지금 5개 먼저</p>
              <h2>다음 방을 떠올리고 직접 체크해보세요.</h2>
              <p>체크한 내용은 이 기기에 저장하거나 전송하지 않습니다.</p>
            </div>

            <div className="checklist-shell reveal">
              <div className="checklist-shell__top">
                <div>
                  <span>후보 매물 현장 체크</span>
                  <strong>{checkedLabel}</strong>
                </div>
                <div className="checklist-progress" aria-hidden="true">
                  <i style={{ width: `${(checked.length / previewChecks.length) * 100}%` }} />
                </div>
              </div>

              <div className="preview-checks">
                {previewChecks.map((item) => {
                  const isChecked = checked.includes(item.id);
                  return (
                    <label className={`preview-check${isChecked ? " is-checked" : ""}`} key={item.id}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <span className="preview-check__box" aria-hidden="true">✓</span>
                      <span className="preview-check__copy">
                        <small>{item.category}</small>
                        <strong>{item.title}</strong>
                        <span>{item.note}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="checklist-shell__locked">
                <span>+ 19</span>
                <p>
                  수압·배수·방음·옵션·계약 특약·입주 기록까지
                  <br />
                  전체 체크리스트와 매물 비교 기록지로 이어집니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="august-section august-position">
          <div className="shell august-position__grid">
            <div className="august-position__label reveal">
              <p className="august-kicker">누구의 기준으로 볼 것인가</p>
              <span>임대인</span>
              <span>공인중개사</span>
              <strong>임차인</strong>
            </div>
            <div className="august-position__copy reveal">
              <h2>
                계약을 성사시키는 기준과
                <br />
                계약 후를 살아가는 기준은 다릅니다.
              </h2>
              <p>
                임대인은 집을 내놓고, 공인중개사는 계약을 중개합니다. 각자의 역할이 있습니다.
                자취선배는 그 누구를 의심하라고 말하지 않습니다. 대신 그 집에서 살고 돈을 낼
                임차인이 놓치지 말아야 할 질문을 먼저 꺼냅니다.
              </p>
              <blockquote>
                계약을 성사시키는 쪽이 한편이라면,
                <br />
                <strong>자취선배는 임차인의 편입니다.</strong>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="august-section august-cta" id="request">
          <div className="shell august-cta__inner reveal">
            <div>
              <p className="august-kicker">다음 집을 보기 전에</p>
              <h2>
                24개 전체 체크리스트와
                <br />
                매물 비교 기록지를 받아보세요.
              </h2>
              <p>
                DM에 <strong>“체크리스트”</strong>라고 보내면 됩니다.
                출시 알림보다 먼저, 당장 다음 방에서 쓸 수 있는 도구를 드릴게요.
              </p>
            </div>
            <div className="august-cta__actions">
              <button className="august-btn august-btn--cream" type="button" onClick={copyDmRequest}>
                {copied ? "DM 문구가 복사됐어요" : "DM 요청 문구 복사하기"}
              </button>
              <a
                className="august-btn august-btn--outline"
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noreferrer"
                onClick={trackDmOpen}
              >
                인스타그램 DM 열기
              </a>
              <small>광고 집행 전 자취선배 인스타그램 계정의 직접 DM 링크로 교체합니다.</small>
            </div>
          </div>
        </section>

        <section className="august-sources">
          <div className="shell august-sources__inner">
            <div>
              <p className="august-kicker">확인 근거</p>
              <h2>공식 기준은 공식 출처로 다시 확인합니다.</h2>
            </div>
            <ul>
              <li><a href="https://law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000700002&languageType=KO&lsNm=%EC%A3%BC%ED%83%9D%EC%9E%84%EB%8C%80%EC%B0%A8%EB%B3%B4%ED%98%B8%EB%B2%95&paras=1" target="_blank" rel="noreferrer">주택임대차보호법 · 대항력</a></li>
              <li><a href="https://onestop.khug.or.kr/view/hmr/biz/selfCheck/selfCheck002" target="_blank" rel="noreferrer">HUG · 계약 전 체크리스트</a></li>
              <li><a href="https://m.bokjiro.go.kr/ssis-tem/ssis-tem/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004661" target="_blank" rel="noreferrer">복지로 · 2026 청년월세 지원</a></li>
              <li><a href="https://namc.molit.go.kr/dpconcil/apply/selfDiagnosis.do?menu=1" target="_blank" rel="noreferrer">국토교통부 · 누수 자가진단</a></li>
            </ul>
            <p className="august-sources__notice">
              자취선배는 지원 자격·법적 안전·하자 여부를 확정하지 않습니다. 계약 전 빠진 질문을
              발견하도록 돕고, 최종 판단은 공식 기관과 전문가 확인으로 연결합니다.
            </p>
          </div>
        </section>
      </main>

      <footer className="august-footer">
        <div className="shell august-footer__inner">
          <p className="august-brand august-brand--footer"><ZaruMark size={24} /> 자취선배</p>
          <p>집을 보여주는 사람이 아니라, 그 집에서 살아갈 사람의 편.</p>
          <span>© 2026 자취선배</span>
        </div>
      </footer>
    </div>
  );
}
