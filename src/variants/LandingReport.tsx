import { useEffect, useMemo, useState } from "react";
import { ZaruMark } from "../components/ZaruMark";
import { track, trackOnce } from "../lib/analytics";
import "../styles/landing-report.css";

const INSTAGRAM_DM_URL = "https://www.instagram.com/direct/inbox/";
const DM_REQUEST = "자취선배 임장 리포트를 받고 싶어요.";

const reportItems = [
  {
    id: "rights",
    category: "권리·지원",
    title: "전입신고와 확정일자 가능",
    detail: "계약 전 임대인과 중개사에게 확인",
  },
  {
    id: "cost",
    category: "총주거비",
    title: "관리비 밖 별도 비용 확인",
    detail: "수도·전기·가스·인터넷·주차",
  },
  {
    id: "registry",
    category: "보증금",
    title: "당일 등기부와 선순위 보증금 확인",
    detail: "근저당·압류·세금 체납도 함께 질문",
  },
  {
    id: "moisture",
    category: "하자",
    title: "천장·창틀·외벽 모서리 흔적 확인",
    detail: "최상층은 옥상 방수 이력까지",
  },
  {
    id: "evidence",
    category: "입주 기록",
    title: "기존 하자를 사진과 문장으로 남길 계획",
    detail: "입주 직후 날짜가 보이게 기록",
  },
] as const;

const moneyNotes = [
  { label: "월세 할인", value: "− 5만 원", note: "광고에서 바로 보이는 숫자" },
  { label: "별도 관리비", value: "+ 5만 원", note: "2년이면 120만 원" },
  { label: "지원 조건", value: "최대 480만 원", note: "2026 지원 규모 예시" },
] as const;

export function LandingReport() {
  const [checked, setChecked] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackOnce("view:variant-3", "view", { target: "landing-report" });
  }, []);

  const score = useMemo(() => Math.round((checked.length / reportItems.length) * 100), [checked]);
  const status = score === 100 ? "질문 준비 완료" : score >= 60 ? "조금 더 확인" : "확인 전 항목 많음";

  const toggle = (id: string) => {
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    void track("checklist_interaction", { target: `report-${id}`, payload: { variant: 3 } });
  };

  const copyDm = async () => {
    try {
      await navigator.clipboard.writeText(DM_REQUEST);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
    void track("checklist_cta_click", { target: "copy-dm", payload: { variant: 3 } });
  };

  return (
    <div className="report-page">
      <header className="report-nav">
        <a href="#top" className="report-brand">
          <ZaruMark size={25} />
          <b>자취선배</b>
        </a>
        <nav aria-label="페이지 목차">
          <a href="#money">비용 비교</a>
          <a href="#report">임장 리포트</a>
          <a href="#receive">전체 체크리스트</a>
        </nav>
      </header>

      <main id="top">
        <section className="report-hero">
          <div className="report-hero__copy">
            <div className="report-status"><i /> 2026 AUGUST ROOM CHECK</div>
            <h1>
              좋은 방을 고르는
              <br />
              가장 객관적인 <em>10분.</em>
            </h1>
            <p>
              월세가 5만 원 싼 이유부터 전입신고, 보증금 권리, 누수 흔적까지.
              매물마다 같은 기준으로 질문하고 기록하면 느낌이 아니라 근거로 고를 수 있습니다.
            </p>
            <div className="report-hero__actions">
              <a href="#report">샘플 리포트 작성하기</a>
              <span>가입 없이 5개 항목을 먼저 써보세요.</span>
            </div>
          </div>

          <div className="report-sheet" aria-label="후보 매물 임장 리포트 예시">
            <div className="report-sheet__head">
              <div>
                <span>ROOM REPORT</span>
                <b>후보 매물 A</b>
              </div>
              <strong>A–01</strong>
            </div>
            <dl>
              <div><dt>위치</dt><dd>역에서 도보 5분</dd></div>
              <div><dt>구조</dt><dd>최상층 · 외벽 코너</dd></div>
              <div><dt>표시 월세</dt><dd>주변보다 −5만 원</dd></div>
              <div><dt>확인 상태</dt><dd><mark>4개 질문 전</mark></dd></div>
            </dl>
            <div className="report-sheet__plan">
              <span className="report-pin report-pin--roof">옥상 방수</span>
              <span className="report-pin report-pin--window">창틀 결로</span>
              <span className="report-pin report-pin--wall">가구 뒤</span>
              <div className="report-room report-room--bed">침실</div>
              <div className="report-room report-room--kitchen">주방</div>
              <div className="report-room report-room--bath">욕실</div>
            </div>
            <div className="report-sheet__result">
              <span>현재 판단</span>
              <b>싸다</b>
              <i>→</i>
              <strong>확인 중</strong>
            </div>
          </div>
        </section>

        <section className="report-principle">
          <span>집을 내놓는 사람의 기준</span>
          <i>≠</i>
          <span>계약을 중개하는 사람의 기준</span>
          <i>≠</i>
          <strong>그 집에서 살아갈 임차인의 기준</strong>
        </section>

        <section className="report-money" id="money">
          <div className="report-section-title">
            <p>01 · PRICE IS NOT TOTAL COST</p>
            <h2>보이는 월세와<br />실제로 나갈 돈을 나눠봅니다.</h2>
          </div>
          <div className="report-money__grid">
            {moneyNotes.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
          <div className="report-equation">
            <span>월세</span><i>+</i><span>관리비</span><i>+</i><span>놓치는 지원</span><i>+</i><span>하자 비용</span>
            <b>= 2년 총주거비</b>
          </div>
          <p className="report-note">
            * 최대 480만 원은 2026 청년월세 지원의 월 최대 20만 원·최대 24개월 기준 예시입니다.
            실제 지원 여부는 모집 시기와 개인·매물 조건에 따라 달라집니다.
          </p>
        </section>

        <section className="report-builder" id="report">
          <div className="report-builder__intro">
            <p>02 · TRY THE REPORT</p>
            <h2>다음 방을 떠올리고<br />확인한 것만 체크하세요.</h2>
            <p>체크 내용은 저장하거나 전송하지 않습니다. 지금 놓친 질문을 발견하는 미리보기입니다.</p>
            <div className="report-meter">
              <div className="report-meter__ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}>
                <strong>{score}</strong><span>/100</span>
              </div>
              <div><small>임장 준비도</small><b>{status}</b><span>{checked.length} / {reportItems.length} 확인</span></div>
            </div>
          </div>

          <div className="report-list">
            {reportItems.map((item, index) => {
              const active = checked.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  className={active ? "is-checked" : ""}
                  onClick={() => toggle(item.id)}
                  aria-pressed={active}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{item.category}</small><b>{item.title}</b><p>{item.detail}</p></div>
                  <i>{active ? "✓" : "+"}</i>
                </button>
              );
            })}
            <div className="report-locked">
              <span>+19</span>
              <p><b>수압·배수·방음·옵션·특약·입주 기록</b><br />전체 리포트에는 비교에 필요한 24개 항목이 담깁니다.</p>
            </div>
          </div>
        </section>

        <section className="report-timeline">
          <div className="report-section-title">
            <p>03 · BEFORE / ON SITE / AFTER</p>
            <h2>방을 보기 전부터<br />계약 직전까지 한 흐름으로.</h2>
          </div>
          <ol>
            <li><span>01</span><b>가기 전</b><p>등기·건축물·지원 조건을 먼저 준비</p></li>
            <li><span>02</span><b>현장에서</b><p>같은 질문과 사진으로 매물마다 기록</p></li>
            <li><span>03</span><b>돌아와서</b><p>월세가 아닌 총비용과 위험으로 비교</p></li>
            <li><span>04</span><b>계약 전에</b><p>확인한 내용을 특약과 증거로 남기기</p></li>
          </ol>
        </section>

        <section className="report-side">
          <div><span>임대인</span><span>공인중개사</span><span>자취선배</span></div>
          <blockquote>
            계약을 성사시키는 쪽이 한편이라면,
            <br />
            <strong>자취선배는 계약 후를 살아갈 임차인의 편입니다.</strong>
          </blockquote>
        </section>

        <section className="report-cta" id="receive">
          <div>
            <p>NEXT VIEWING, BETTER DECISION.</p>
            <h2>24개 전체 임장 리포트를<br />다음 방에서 사용해보세요.</h2>
          </div>
          <div className="report-cta__actions">
            <button type="button" onClick={copyDm}>{copied ? "DM 문구가 복사됐어요" : "DM 요청 문구 복사하기"}</button>
            <a href={INSTAGRAM_DM_URL} target="_blank" rel="noreferrer">인스타그램 DM 열기 ↗</a>
            <small>실제 계정 확정 후 직접 DM 링크로 교체합니다.</small>
          </div>
        </section>
      </main>

      <footer className="report-footer">
        <b><ZaruMark size={21} /> 자취선배</b>
        <span>집을 보여주는 사람이 아니라, 그 집에서 살아갈 사람의 편.</span>
        <small>© 2026</small>
      </footer>
    </div>
  );
}
