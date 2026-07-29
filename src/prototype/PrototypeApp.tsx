import { FormEvent, useEffect, useMemo, useState } from "react";
import { track, trackOnce } from "../lib/analytics";
import { evaluateCandidate } from "./evaluate";
import type {
  CandidateDecision,
  CandidateHome,
  PersonalProfile,
  SupportProgram,
} from "./types";

const initialProfile: PersonalProfile = {
  awareness: "none",
  ageBand: "unknown",
  separateFromParents: "unknown",
  homeOwnership: "unknown",
  incomeCheck: "unknown",
  employment: "unknown",
  previousSupport: "unknown",
};

const initialHome: CandidateHome = {
  nickname: "",
  region: "unknown",
  deposit: "",
  rent: "",
  housingType: "unknown",
  moveInRegistration: "unknown",
  contractProof: "unknown",
  paymentProof: "unknown",
  receiptPlan: "unknown",
};

const STEP_LABELS = ["안내", "나의 조건", "후보 집", "확인 결과"];

function participantId(): string {
  if (typeof window === "undefined") return "익명";
  const params = new URLSearchParams(window.location.search);
  return params.get("participant") ?? params.get("pid") ?? "익명";
}

export function PrototypeApp() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<PersonalProfile>(initialProfile);
  const [home, setHome] = useState<CandidateHome>(initialHome);
  const [decision, setDecision] = useState<CandidateDecision>("");
  const [note, setNote] = useState("");
  const [listingCount, setListingCount] = useState(1);
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");
  const [recordCopyState, setRecordCopyState] =
    useState<"idle" | "done" | "failed">("idle");
  const pid = useMemo(participantId, []);
  const result = useMemo(() => evaluateCandidate(profile, home), [profile, home]);

  useEffect(() => {
    trackOnce("prototype_view", "view", {
      target: "multi_support_check_prototype",
      payload: { participant: pid },
    });
  }, [pid]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [step]);

  const goTo = (nextStep: number) => {
    setStep(nextStep);
    void track("prototype_step", {
      target: STEP_LABELS[nextStep],
      payload: { participant: pid, listing: listingCount },
    });
  };

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void track("profile_completed", {
      target: profile.awareness,
      payload: { participant: pid },
    });
    goTo(2);
  };

  const submitHome = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void track("listing_completed", {
      target: home.nickname || `candidate_${listingCount}`,
      payload: {
        participant: pid,
        listing: listingCount,
        region: home.region,
        housingType: home.housingType,
        unknownTransfer: home.moveInRegistration === "unknown",
      },
    });
    void track("result_viewed", {
      target: "multi_support_map",
      payload: {
        participant: pid,
        listing: listingCount,
        awareness: profile.awareness,
        programs: result.programs.length,
        openPrograms: result.programs.filter((item) => item.status === "open").length,
        verify: result.verify.length,
        risk: result.risk.length,
      },
    });
    goTo(3);
  };

  const copyQuestions = async () => {
    const text = [
      `[${home.nickname || "후보 집"} 계약 전 질문]`,
      ...result.questions.map((question, index) => `${index + 1}. ${question}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("done");
      void track("question_copied", {
        target: "realtor_questions",
        payload: { participant: pid, listing: listingCount, count: result.questions.length },
      });
    } catch {
      setCopyState("failed");
    }
  };

  const saveDecision = () => {
    void track("decision_saved", {
      target: decision || "undecided",
      payload: {
        participant: pid,
        listing: listingCount,
        hasNote: note.trim().length > 0,
      },
    });
  };

  const copyResearchRecord = async () => {
    const decisionLabels: Record<Exclude<CandidateDecision, "">, string> = {
      keep: "계속 후보",
      hold: "확인 전까지 보류",
      drop: "후보에서 제외",
      undecided: "아직 판단하지 못함",
    };
    const record = [
      "[자취선배 프로토타입 검증 기록]",
      `참가자: ${pid}`,
      `후보 집: ${listingCount}번째 · ${home.nickname || "이름 없음"}`,
      `사용 전 인지 수준: ${result.awarenessLabel}`,
      `새로 확인한 지원: ${result.programs.map((item) => `${item.name}(${item.statusLabel})`).join(" | ")}`,
      `계약 전 추가 확인: ${[...result.risk, ...result.verify].map((item) => item.label).join(", ") || "없음"}`,
      `새로 생긴 질문: ${result.questions.join(" | ")}`,
      `남겨야 할 증빙: ${result.evidence.join(" | ")}`,
      `후보 판단: ${decision ? decisionLabels[decision] : "기록 전"}`,
      `판단 메모: ${note.trim() || "없음"}`,
      `기록 시각: ${new Date().toLocaleString("ko-KR")}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(record);
      setRecordCopyState("done");
      void track("research_record_copied", {
        target: `candidate_${listingCount}`,
        payload: {
          participant: pid,
          listing: listingCount,
          decision: decision || "not_recorded",
          programs: result.programs.length,
        },
      });
    } catch {
      setRecordCopyState("failed");
    }
  };

  const checkAnotherHome = () => {
    const nextListing = listingCount + 1;
    setListingCount(nextListing);
    setHome(initialHome);
    setDecision("");
    setNote("");
    setCopyState("idle");
    setRecordCopyState("idle");
    void track("second_listing_started", {
      target: `candidate_${nextListing}`,
      payload: { participant: pid, listing: nextListing },
    });
    goTo(2);
  };

  return (
    <div className="prototype">
      <a className="skip-link" href="#prototype-main">
        본문으로 건너뛰기
      </a>

      <header className="prototype-header">
        <a
          className="prototype-brand"
          href={`${window.location.pathname}${window.location.search}`}
          aria-label="자취선배 프로토타입 처음으로"
        >
          <span className="prototype-brand__mark" aria-hidden="true">ㅈ</span>
          <span>
            <strong>자취선배</strong>
            <small>계약 전 주거지원 확인</small>
          </span>
        </a>
        <span className="prototype-badge">검증용 프로토타입</span>
      </header>

      <div className="prototype-progress" aria-label={`전체 4단계 중 ${step + 1}단계`}>
        <div className="prototype-progress__meta">
          <span>{STEP_LABELS[step]}</span>
          <span>{step + 1} / 4</span>
        </div>
        <div className="prototype-progress__track" aria-hidden="true">
          <span style={{ width: `${((step + 1) / 4) * 100}%` }} />
        </div>
      </div>

      <main id="prototype-main" className="prototype-main">
        {step === 0 && (
          <section className="prototype-intro" aria-labelledby="intro-title">
            <p className="prototype-kicker">싼 월세만 보고 계약하기 전에</p>
            <h1 id="intro-title">
              이 집에서 받을 지원과
              <br />
              놓치면 안 될 조건을 확인하세요
            </h1>
            <p className="prototype-intro__lead">
              지역·보증금·월세·전입신고·계약 증빙에 따라 달라지는 월세지원,
              보증금 이자지원, 이사비 지원과 다음 행동을 함께 보여드려요.
            </p>

            <div className="prototype-flow" aria-label="확인 과정">
              <span>내가 알던 정보</span>
              <b aria-hidden="true">＋</b>
              <span>실제 후보 집</span>
              <b aria-hidden="true">→</b>
              <span>지원·질문·증빙</span>
            </div>

            <div className="prototype-notice">
              <strong>고시원이나 전입신고 미표시 매물도 확인할 수 있어요</strong>
              <p>
                고시원이라고 모든 지원에서 제외되는 것은 아닙니다. 전입신고,
                입실확인서, 월세 납부 증빙 등 지원별로 달라지는 조건을 확인해요.
              </p>
            </div>

            <button
              className="prototype-button prototype-button--primary"
              type="button"
              onClick={() => {
                void track("prototype_start", {
                  target: "start",
                  payload: { participant: pid },
                });
                goTo(1);
              }}
            >
              실제 후보 집으로 확인하기
            </button>
            <p className="prototype-privacy">
              입력 내용은 이 브라우저 화면에서만 사용하며 이벤트에는 개인 조건을
              저장하지 않습니다.
            </p>
          </section>
        )}

        {step === 1 && (
          <section className="prototype-card" aria-labelledby="profile-title">
            <div className="prototype-card__heading">
              <p className="prototype-kicker">1. 사용 전 상태</p>
              <h1 id="profile-title">지금 알고 있는 만큼만 답해주세요</h1>
              <p>지원제도를 몰라도 괜찮아요. 모르는 항목은 그대로 선택해주세요.</p>
            </div>

            <form onSubmit={submitProfile}>
              <fieldset className="prototype-fieldset">
                <legend>주거지원에 대해 어디까지 알고 있었나요?</legend>
                <p className="prototype-help">프로토타입 사용 전의 상태를 그대로 선택해주세요.</p>
                <RadioCards
                  name="awareness"
                  value={profile.awareness}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      awareness: value as PersonalProfile["awareness"],
                    }))
                  }
                  options={[
                    ["none", "관련 제도가 있는지 몰랐어요"],
                    ["nameOnly", "청년월세지원이라는 이름만 들어봤어요"],
                    ["checkedMine", "나의 나이·소득 조건은 확인해봤어요"],
                    ["checkedHome", "후보 집의 조건까지 확인해봤어요"],
                    ["applied", "직접 신청하거나 지원받은 경험이 있어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>출생연도가 어디에 해당하나요?</legend>
                <p className="prototype-help">정확한 생년월일은 입력하지 않습니다.</p>
                <RadioCards
                  name="ageBand"
                  value={profile.ageBand}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      ageBand: value as PersonalProfile["ageBand"],
                    }))
                  }
                  options={[
                    ["national", "1991년~2007년 출생"],
                    ["localOnly", "1986년~1990년 출생"],
                    ["outside", "해당 범위 밖"],
                    ["unknown", "아직 확인하지 못했어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>부모님과 따로 거주하거나 거주할 예정인가요?</legend>
                <RadioCards
                  name="separateFromParents"
                  value={profile.separateFromParents}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      separateFromParents: value as PersonalProfile["separateFromParents"],
                    }))
                  }
                  options={[
                    ["yes", "따로 거주해요"],
                    ["no", "함께 거주해요"],
                    ["unknown", "아직 정하지 못했어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>본인 명의의 주택이 있나요?</legend>
                <RadioCards
                  name="homeOwnership"
                  value={profile.homeOwnership}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      homeOwnership: value as PersonalProfile["homeOwnership"],
                    }))
                  }
                  options={[
                    ["no", "없어요"],
                    ["yes", "있어요"],
                    ["unknown", "잘 모르겠어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>본인의 소득 기준을 확인해본 적이 있나요?</legend>
                <p className="prototype-help">정확한 소득 금액은 입력하지 않습니다.</p>
                <RadioCards
                  name="incomeCheck"
                  value={profile.incomeCheck}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      incomeCheck: value as PersonalProfile["incomeCheck"],
                    }))
                  }
                  options={[
                    ["within", "지원 기준 안으로 확인했어요"],
                    ["outside", "기준을 넘을 것 같아요"],
                    ["unknown", "아직 확인하지 못했어요"],
                  ]}
                />
              </fieldset>

              <label className="prototype-field">
                <span>현재 상태</span>
                <select
                  value={profile.employment}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      employment: event.target.value as PersonalProfile["employment"],
                    }))
                  }
                >
                  <option value="unknown">아직 선택하지 않을게요</option>
                  <option value="employed">근로 중</option>
                  <option value="startup">사업 중</option>
                  <option value="jobseeker">취업 준비 중</option>
                  <option value="student">학생</option>
                  <option value="other">그 외</option>
                </select>
              </label>

              <fieldset className="prototype-fieldset">
                <legend>월세·보증금·이사비 주거지원을 받은 적이 있나요?</legend>
                <RadioCards
                  name="previousSupport"
                  value={profile.previousSupport}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      previousSupport: value as PersonalProfile["previousSupport"],
                    }))
                  }
                  options={[
                    ["no", "없어요"],
                    ["yes", "있어요"],
                    ["unknown", "잘 모르겠어요"],
                  ]}
                />
              </fieldset>

              <div className="prototype-actions">
                <button className="prototype-button prototype-button--ghost" type="button" onClick={() => goTo(0)}>
                  이전
                </button>
                <button className="prototype-button prototype-button--primary" type="submit">
                  후보 집 입력하기
                </button>
              </div>
            </form>
          </section>
        )}

        {step === 2 && (
          <section className="prototype-card" aria-labelledby="home-title">
            <div className="prototype-card__heading">
              <p className="prototype-kicker">{listingCount}. 후보 집</p>
              <h1 id="home-title">실제로 알아본 매물을 입력해주세요</h1>
              <p>중개인 연락처와 상세 주소는 입력하지 않아도 됩니다.</p>
            </div>

            <form onSubmit={submitHome}>
              <label className="prototype-field">
                <span>후보 집을 구분할 이름</span>
                <input
                  required
                  value={home.nickname}
                  onChange={(event) =>
                    setHome((current) => ({ ...current, nickname: event.target.value }))
                  }
                  placeholder="예: 학교 근처 월세 40 고시원"
                  autoComplete="off"
                />
              </label>

              <fieldset className="prototype-fieldset">
                <legend>후보 집은 어느 지역에 있나요?</legend>
                <RadioCards
                  name="homeRegion"
                  value={home.region}
                  onChange={(value) =>
                    setHome((current) => ({
                      ...current,
                      region: value as CandidateHome["region"],
                    }))
                  }
                  options={[
                    ["seoul", "서울"],
                    ["seongnam", "성남"],
                    ["otherCapital", "그 외 경기·인천"],
                    ["outside", "수도권 외 지역"],
                    ["unknown", "아직 확인하지 못했어요"],
                  ]}
                />
              </fieldset>

              <div className="prototype-money-grid">
                <label className="prototype-field">
                  <span>보증금</span>
                  <span className="prototype-input-unit">
                    <input
                      inputMode="numeric"
                      min="0"
                      required
                      type="number"
                      value={home.deposit}
                      onChange={(event) =>
                        setHome((current) => ({ ...current, deposit: event.target.value }))
                      }
                      placeholder="300"
                    />
                    <b>만원</b>
                  </span>
                </label>
                <label className="prototype-field">
                  <span>월세</span>
                  <span className="prototype-input-unit">
                    <input
                      inputMode="numeric"
                      min="0"
                      required
                      type="number"
                      value={home.rent}
                      onChange={(event) =>
                        setHome((current) => ({ ...current, rent: event.target.value }))
                      }
                      placeholder="40"
                    />
                    <b>만원</b>
                  </span>
                </label>
              </div>

              <label className="prototype-field">
                <span>주택 형태</span>
                <select
                  value={home.housingType}
                  onChange={(event) =>
                    setHome((current) => ({
                      ...current,
                      housingType: event.target.value as CandidateHome["housingType"],
                    }))
                  }
                >
                  <option value="unknown">아직 확인하지 못했어요</option>
                  <option value="studio">원룸</option>
                  <option value="officetel">오피스텔</option>
                  <option value="villa">빌라</option>
                  <option value="goshiwon">고시원·고시텔</option>
                  <option value="sharehouse">셰어하우스</option>
                  <option value="other">기타</option>
                </select>
              </label>

              <fieldset className="prototype-fieldset">
                <legend>전입신고가 가능한지 확인했나요?</legend>
                <RadioCards
                  name="moveInRegistration"
                  value={home.moveInRegistration}
                  onChange={(value) =>
                    setHome((current) => ({
                      ...current,
                      moveInRegistration: value as CandidateHome["moveInRegistration"],
                    }))
                  }
                  options={[
                    ["yes", "가능하다고 확인했어요"],
                    ["no", "불가능하다고 들었어요"],
                    ["unknown", "매물에 표시가 없거나 아직 물어보지 못했어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>계약서나 입실확인서를 받을 수 있나요?</legend>
                <RadioCards
                  name="contractProof"
                  value={home.contractProof}
                  onChange={(value) =>
                    setHome((current) => ({
                      ...current,
                      contractProof: value as CandidateHome["contractProof"],
                    }))
                  }
                  options={[
                    ["yes", "받을 수 있다고 확인했어요"],
                    ["no", "발급이 어렵다고 들었어요"],
                    ["unknown", "아직 확인하지 못했어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>월세 납부 기록을 남길 수 있나요?</legend>
                <RadioCards
                  name="paymentProof"
                  value={home.paymentProof}
                  onChange={(value) =>
                    setHome((current) => ({
                      ...current,
                      paymentProof: value as CandidateHome["paymentProof"],
                    }))
                  }
                  options={[
                    ["yes", "계좌이체나 납부확인서로 남길 수 있어요"],
                    ["no", "현금 납부이고 증빙이 어렵다고 들었어요"],
                    ["unknown", "아직 확인하지 못했어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>중개보수와 이사비 영수증을 받을 예정인가요?</legend>
                <RadioCards
                  name="receiptPlan"
                  value={home.receiptPlan}
                  onChange={(value) =>
                    setHome((current) => ({
                      ...current,
                      receiptPlan: value as CandidateHome["receiptPlan"],
                    }))
                  }
                  options={[
                    ["yes", "영수증을 받아 보관할 예정이에요"],
                    ["no", "받지 않을 것 같아요"],
                    ["unknown", "생각해보지 못했어요"],
                  ]}
                />
              </fieldset>

              <div className="prototype-actions">
                <button className="prototype-button prototype-button--ghost" type="button" onClick={() => goTo(1)}>
                  이전
                </button>
                <button className="prototype-button prototype-button--primary" type="submit">
                  지원과 계약 조건 확인하기
                </button>
              </div>
            </form>
          </section>
        )}

        {step === 3 && (
          <section className="prototype-result" aria-labelledby="result-title" aria-live="polite">
            <div className="prototype-result__hero">
              <p className="prototype-kicker">{home.nickname || "후보 집"} · 확인 결과</p>
              <h1 id="result-title">{result.headline}</h1>
              <p>{result.description}</p>
              <p className="prototype-awareness">
                <span>사용 전</span>
                {result.awarenessLabel}
              </p>
              <div className="prototype-score" aria-label="확인 결과 요약">
                <span><b>{result.programs.length}</b>확인할 지원</span>
                <span><b>{result.programs.filter((item) => item.status === "open").length}</b>현재 신청 경로</span>
                <span><b>{result.verify.length + result.risk.length}</b>계약 전 확인</span>
              </div>
            </div>

            <section className="prototype-programs" aria-labelledby="programs-title">
              <div className="prototype-section-heading">
                <p className="prototype-kicker">지역과 후보 집을 함께 비교한 결과</p>
                <h2 id="programs-title">확인할 주거지원</h2>
                <p>마감된 사업도 다음 모집을 준비할 수 있도록 필요한 행동을 보여드려요.</p>
              </div>
              <div className="prototype-program-list">
                {result.programs.map((item) => (
                  <ProgramCard
                    key={item.id}
                    program={item}
                    onOfficialClick={() =>
                      void track("official_source_clicked", {
                        target: item.id,
                        payload: { participant: pid, listing: listingCount },
                      })
                    }
                  />
                ))}
              </div>
            </section>

            {result.risk.length > 0 && (
              <ResultGroup
                title="계약 전에 멈춰서 확인할 조건"
                description="후보 집을 포기하라는 뜻이 아니라, 계약 전에 공식 확인이 필요한 항목이에요."
                checks={result.risk}
                tone="risk"
              />
            )}
            {result.verify.length > 0 && (
              <ResultGroup
                title="아직 확인하지 못한 조건"
                description="중개인이나 공식 기관에 물어볼 질문으로 바꿔보세요."
                checks={result.verify}
                tone="verify"
              />
            )}

            <section className="prototype-result-card prototype-questions" aria-labelledby="questions-title">
              <div className="prototype-result-card__heading">
                <span className="prototype-result-card__icon" aria-hidden="true">?</span>
                <div>
                  <p className="prototype-kicker">다음 행동</p>
                  <h2 id="questions-title">계약 전에 물어볼 질문</h2>
                </div>
              </div>
              <ol>
                {result.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
              <button className="prototype-button prototype-button--secondary" type="button" onClick={copyQuestions}>
                {copyState === "done" ? "질문을 복사했어요" : "질문 목록 복사하기"}
              </button>
              {copyState === "failed" && (
                <p className="prototype-error">복사하지 못했어요. 질문을 직접 선택해 복사해주세요.</p>
              )}
            </section>

            <section className="prototype-result-card prototype-evidence" aria-labelledby="evidence-title">
              <div className="prototype-result-card__heading">
                <span className="prototype-result-card__icon" aria-hidden="true">▣</span>
                <div>
                  <p className="prototype-kicker">계약 순간부터</p>
                  <h2 id="evidence-title">나중을 위해 남길 증빙</h2>
                </div>
              </div>
              <ul>
                {result.evidence.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="prototype-result-card" aria-labelledby="decision-title">
              <div className="prototype-result-card__heading">
                <span className="prototype-result-card__icon" aria-hidden="true">✓</span>
                <div>
                  <p className="prototype-kicker">판단 기록</p>
                  <h2 id="decision-title">이 집을 후보로 남길까요?</h2>
                </div>
              </div>
              <RadioCards
                name="decision"
                value={decision}
                onChange={(value) => setDecision(value as CandidateDecision)}
                options={[
                  ["keep", "계속 후보로 둘게요"],
                  ["hold", "확인할 때까지 보류할게요"],
                  ["drop", "후보에서 제외할게요"],
                  ["undecided", "아직 판단하지 못했어요"],
                ]}
              />
              <label className="prototype-field">
                <span>프로토타입을 본 뒤 판단이 달라졌다면 이유를 남겨주세요</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="예: 싼 월세만 봤는데 전입신고와 입실확인서를 먼저 확인하기로 함"
                  rows={4}
                />
              </label>
              <button
                className="prototype-button prototype-button--secondary"
                type="button"
                disabled={!decision}
                onClick={saveDecision}
              >
                판단 기록하기
              </button>
            </section>

            <section className="prototype-result-card prototype-export" aria-labelledby="export-title">
              <div className="prototype-result-card__heading">
                <span className="prototype-result-card__icon" aria-hidden="true">↗</span>
                <div>
                  <p className="prototype-kicker">인터뷰 기록</p>
                  <h2 id="export-title">사용 전후 변화를 보내주세요</h2>
                  <p>
                    개인 조건과 금액은 제외하고, 사용 전 인지 수준·새로 확인한
                    지원·질문·후보 판단만 복사합니다.
                  </p>
                </div>
              </div>
              <button
                className="prototype-button prototype-button--secondary"
                type="button"
                onClick={copyResearchRecord}
              >
                {recordCopyState === "done" ? "검증 기록을 복사했어요" : "익명 검증 기록 복사하기"}
              </button>
              {recordCopyState === "done" && (
                <p className="prototype-export__success">
                  1:1 오픈채팅으로 돌아가 붙여넣어 주세요.
                </p>
              )}
              {recordCopyState === "failed" && (
                <p className="prototype-error">
                  복사하지 못했어요. 이 결과 화면을 캡처해 보내주세요.
                </p>
              )}
            </section>

            <section className="prototype-official" aria-labelledby="official-title">
              <p className="prototype-kicker">2026년 7월 30일 기준</p>
              <h2 id="official-title">지원은 찾되, 자격을 단정하지 않아요</h2>
              <p>
                모집 일정과 조건은 바뀔 수 있습니다. 각 카드의 공식 기준에서
                최신 공고와 본인의 최종 신청 가능 여부를 확인해주세요.
              </p>
            </section>

            <div className="prototype-result__actions">
              <button className="prototype-button prototype-button--primary" type="button" onClick={checkAnotherHome}>
                다음 후보 집도 확인하기
              </button>
              <button className="prototype-button prototype-button--ghost" type="button" onClick={() => goTo(2)}>
                이 집 조건 수정하기
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="prototype-footer">
        <strong>자취선배</strong>
        <span>지원 대상 여부를 확정하거나 신청을 대행하지 않습니다.</span>
        <span>참가자 {pid}</span>
      </footer>
    </div>
  );
}

interface RadioCardsProps {
  name: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}

function RadioCards({ name, value, options, onChange }: RadioCardsProps) {
  return (
    <div className="prototype-radio-group">
      {options.map(([optionValue, label]) => (
        <label className="prototype-radio" key={optionValue}>
          <input
            checked={value === optionValue}
            name={name}
            onChange={() => onChange(optionValue)}
            type="radio"
            value={optionValue}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

interface ProgramCardProps {
  program: SupportProgram;
  onOfficialClick: () => void;
}

function ProgramCard({ program, onOfficialClick }: ProgramCardProps) {
  return (
    <article className={`prototype-program-card prototype-program-card--${program.fit}`}>
      <div className="prototype-program-card__top">
        <span className={`prototype-status prototype-status--${program.status}`}>
          {program.statusLabel}
        </span>
        <span className={`prototype-fit prototype-fit--${program.fit}`}>{program.fitLabel}</span>
      </div>
      <p className="prototype-program-card__organizer">{program.organizer}</p>
      <h3>{program.name}</h3>
      <p className="prototype-program-card__summary">{program.summary}</p>
      <ul className="prototype-program-card__reasons">
        {program.reasons.map((reason) => <li key={reason}>{reason}</li>)}
      </ul>
      <div className="prototype-program-card__actions">
        <strong>지금 할 일</strong>
        <ol>
          {program.actions.map((action) => <li key={action}>{action}</li>)}
        </ol>
      </div>
      <a href={program.officialUrl} target="_blank" rel="noreferrer" onClick={onOfficialClick}>
        공식 기준 확인하기 <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

interface ResultGroupProps {
  title: string;
  description: string;
  checks: ReturnType<typeof evaluateCandidate>["matched"];
  tone: "matched" | "verify" | "risk";
}

function ResultGroup({ title, description, checks, tone }: ResultGroupProps) {
  return (
    <section className={`prototype-result-card prototype-result-card--${tone}`}>
      <div className="prototype-result-card__heading">
        <span className="prototype-result-card__icon" aria-hidden="true">
          {tone === "matched" ? "✓" : tone === "verify" ? "?" : "!"}
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <ul className="prototype-check-list">
        {checks.map((check) => (
          <li key={`${check.label}-${check.summary}`}>
            <span>{check.label}</span>
            <div>
              <strong>{check.summary}</strong>
              <p>{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
