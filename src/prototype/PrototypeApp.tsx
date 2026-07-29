import { FormEvent, useEffect, useMemo, useState } from "react";
import { track, trackOnce } from "../lib/analytics";
import { evaluateCandidate } from "./evaluate";
import type {
  CandidateDecision,
  CandidateHome,
  PersonalProfile,
} from "./types";

const OFFICIAL_URL =
  "https://housing.seoul.go.kr/site/main/content/sh01_060513?tr_code=short";

const initialProfile: PersonalProfile = {
  ageBand: "unknown",
  residencePlan: "unknown",
  homeOwnership: "unknown",
  incomeCheck: "unknown",
  previousSupport: "unknown",
};

const initialHome: CandidateHome = {
  nickname: "",
  region: "unknown",
  deposit: "",
  rent: "",
  housingType: "unknown",
  moveInRegistration: "unknown",
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
  const pid = useMemo(participantId, []);
  const result = useMemo(() => evaluateCandidate(profile, home), [profile, home]);

  useEffect(() => {
    trackOnce("prototype_view", "view", {
      target: "support_check_prototype",
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
      target: "personal_profile",
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
        unknownTransfer: home.moveInRegistration === "unknown",
      },
    });
    void track("result_viewed", {
      target: result.risk.length > 0 ? "risk" : result.verify.length > 0 ? "verify" : "matched",
      payload: {
        participant: pid,
        listing: listingCount,
        matched: result.matched.length,
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

  const checkAnotherHome = () => {
    const nextListing = listingCount + 1;
    setListingCount(nextListing);
    setHome(initialHome);
    setDecision("");
    setNote("");
    setCopyState("idle");
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
            <small>계약 전 지원조건 확인</small>
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
            <p className="prototype-kicker">이 집을 계약하기 전에</p>
            <h1 id="intro-title">
              지원조건과 후보 집을
              <br />
              같이 확인해보세요
            </h1>
            <p className="prototype-intro__lead">
              내 조건만 확인하고 계약하면 후보 집의 지역·보증금·월세·전입신고
              조건을 뒤늦게 발견할 수 있어요.
            </p>

            <div className="prototype-flow" aria-label="확인 과정">
              <span>나의 조건</span>
              <b aria-hidden="true">＋</b>
              <span>후보 집</span>
              <b aria-hidden="true">→</b>
              <span>질문과 다음 행동</span>
            </div>

            <div className="prototype-notice">
              <strong>먼저 알아두세요</strong>
              <p>
                이 화면은 사용 흐름을 확인하기 위한 프로토타입입니다. 지원 대상
                여부를 확정하지 않으며, 2026년 서울시 청년월세지원 공개 기준을
                참고해 확인할 질문을 안내합니다.
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
              후보 집 확인 시작하기
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
              <p className="prototype-kicker">1. 나의 조건</p>
              <h1 id="profile-title">정확하지 않아도 괜찮아요</h1>
              <p>모르는 항목은 ‘아직 확인하지 못했어요’를 선택해주세요.</p>
            </div>

            <form onSubmit={submitProfile}>
              <fieldset className="prototype-fieldset">
                <legend>출생연도가 어디에 해당하나요?</legend>
                <p className="prototype-help">2026년 서울시 공고의 연령 기준을 참고합니다.</p>
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
                    ["eligible", "1986년~2007년 출생"],
                    ["outside", "해당 범위 밖"],
                    ["unknown", "아직 확인하지 못했어요"],
                  ]}
                />
              </fieldset>

              <fieldset className="prototype-fieldset">
                <legend>지원 신청 시 서울에 전입해 거주할 예정인가요?</legend>
                <RadioCards
                  name="residencePlan"
                  value={profile.residencePlan}
                  onChange={(value) =>
                    setProfile((current) => ({
                      ...current,
                      residencePlan: value as PersonalProfile["residencePlan"],
                    }))
                  }
                  options={[
                    ["seoul", "서울에 거주할 예정이에요"],
                    ["outside", "서울 외 지역에 거주할 예정이에요"],
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

              <fieldset className="prototype-fieldset">
                <legend>서울시 청년월세지원을 받은 적이 있나요?</legend>
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
              <h1 id="home-title">실제 알아본 매물을 입력해주세요</h1>
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
                  placeholder="예: 학교 근처 두 번째 원룸"
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
                    ["capital", "경기·인천"],
                    ["outside", "그 외 지역"],
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
                      placeholder="1000"
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
                      placeholder="55"
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
                    ["unknown", "아직 물어보지 못했어요"],
                  ]}
                />
              </fieldset>

              <div className="prototype-actions">
                <button className="prototype-button prototype-button--ghost" type="button" onClick={() => goTo(1)}>
                  이전
                </button>
                <button className="prototype-button prototype-button--primary" type="submit">
                  계약 전 조건 확인하기
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
              <div className="prototype-score" aria-label="조건 확인 요약">
                <span><b>{result.matched.length}</b>현재 입력과 맞음</span>
                <span><b>{result.verify.length}</b>추가 확인</span>
                <span><b>{result.risk.length}</b>조건 불일치 가능성</span>
              </div>
            </div>

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
            {result.matched.length > 0 && (
              <ResultGroup
                title="현재 입력에서 맞는 조건"
                description="최종 심사 결과가 아니라, 입력한 내용과 공개 기준을 비교한 결과예요."
                checks={result.matched}
                tone="matched"
              />
            )}

            <section className="prototype-result-card prototype-questions" aria-labelledby="questions-title">
              <div className="prototype-result-card__heading">
                <span className="prototype-result-card__icon" aria-hidden="true">?</span>
                <div>
                  <p className="prototype-kicker">다음 행동</p>
                  <h2 id="questions-title">중개인에게 물어볼 질문</h2>
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
                <span>판단이 달라졌다면 이유를 남겨주세요</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="예: 전입신고 가능 여부를 확인하기 전까지 보류"
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

            <section className="prototype-official" aria-labelledby="official-title">
              <p className="prototype-kicker">2026년 7월 30일 기준</p>
              <h2 id="official-title">최종 확인은 공식 공고에서</h2>
              <p>
                2026년 서울시 청년월세지원 신청은 5월 19일에 마감되었습니다.
                다음 모집의 조건과 일정은 달라질 수 있어요.
              </p>
              <a
                href={OFFICIAL_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  void track("official_source_clicked", {
                    target: "seoul_housing_portal",
                    payload: { participant: pid, listing: listingCount },
                  })
                }
              >
                서울주거포털 공식 기준 확인하기
                <span aria-hidden="true">↗</span>
              </a>
            </section>

            <div className="prototype-result__actions">
              <button className="prototype-button prototype-button--primary" type="button" onClick={checkAnotherHome}>
                다른 집도 확인하기
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
