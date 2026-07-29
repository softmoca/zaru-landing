import type {
  CandidateHome,
  ConditionCheck,
  PersonalProfile,
  PrototypeResult,
} from "./types";

const matched = (label: string, summary: string, detail: string): ConditionCheck => ({
  label,
  summary,
  detail,
  tone: "matched",
});

const verify = (label: string, summary: string, detail: string): ConditionCheck => ({
  label,
  summary,
  detail,
  tone: "verify",
});

const risk = (label: string, summary: string, detail: string): ConditionCheck => ({
  label,
  summary,
  detail,
  tone: "risk",
});

export function evaluateCandidate(
  profile: PersonalProfile,
  home: CandidateHome
): PrototypeResult {
  const checks: ConditionCheck[] = [];
  const questions = new Set<string>();

  if (profile.ageBand === "eligible") {
    checks.push(matched("연령", "2026년 서울시 공고의 연령 범위에 들어요", "1986년~2007년 출생 기준"));
  } else if (profile.ageBand === "outside") {
    checks.push(risk("연령", "서울시 청년월세지원 연령 범위를 벗어날 가능성이 있어요", "다른 연령 기준의 주거지원도 함께 확인해보세요"));
  } else {
    checks.push(verify("연령", "출생연도 확인이 필요해요", "2026년 서울시 공고는 1986년~2007년 출생자를 대상으로 안내했어요"));
  }

  if (profile.homeOwnership === "no") {
    checks.push(matched("무주택 여부", "무주택 조건으로 입력했어요", "실제 심사에서는 주택 소유 여부를 다시 확인해요"));
  } else if (profile.homeOwnership === "yes") {
    checks.push(risk("무주택 여부", "주택을 소유한 경우 지원이 어려울 가능성이 있어요", "공식 자격진단에서 보유 주택 범위를 확인하세요"));
  } else {
    checks.push(verify("무주택 여부", "주택 소유 여부를 확인하지 못했어요", "본인 명의의 주택·분양권 등을 공식 자격진단에서 확인하세요"));
  }

  if (profile.incomeCheck === "within") {
    checks.push(matched("소득 기준", "본인이 확인한 소득 기준 안으로 입력했어요", "최종 심사는 건강보험료와 가구 정보를 기준으로 달라질 수 있어요"));
  } else if (profile.incomeCheck === "outside") {
    checks.push(risk("소득 기준", "소득 기준을 벗어날 가능성이 있어요", "가구원 수와 건강보험료 기준을 공식 공고에서 다시 확인하세요"));
  } else {
    checks.push(verify("소득 기준", "소득 기준을 아직 확인하지 않았어요", "정확한 금액 대신 공식 자격진단으로 확인하는 편이 안전해요"));
  }

  if (profile.previousSupport === "yes") {
    checks.push(risk("이전 수혜", "과거 서울시 청년월세지원 수혜 이력이 있어요", "2026년 사업은 생애 1회로 안내되어 있어 중복 지원이 어려울 수 있어요"));
  } else if (profile.previousSupport === "no") {
    checks.push(matched("이전 수혜", "이전 수혜 없음으로 입력했어요", "다른 기관의 유사 지원을 받고 있다면 중복 제한도 확인하세요"));
  } else {
    checks.push(verify("이전 수혜", "과거 지원 이력을 확인하지 못했어요", "서울시·국토교통부·자치구 지원 이력을 함께 확인하세요"));
  }

  if (home.region === "seoul") {
    checks.push(matched("후보 집 지역", "서울에 있는 후보 집이에요", "신청 시점에 주민등록상 서울 거주 조건도 필요해요"));
  } else if (home.region === "capital" || home.region === "outside") {
    checks.push(risk("후보 집 지역", "서울시 청년월세지원 대상 지역이 아니에요", "후보 집이 있는 지자체의 주거지원을 확인해야 해요"));
  } else {
    checks.push(verify("후보 집 지역", "후보 집의 지역을 확인하지 못했어요", "지역마다 지원 사업과 기준이 달라요"));
  }

  if (profile.residencePlan === "seoul" && home.region === "seoul") {
    checks.push(matched("서울 거주", "신청 시 서울 거주 예정으로 입력했어요", "실제 신청일의 주민등록등본을 기준으로 확인해요"));
  } else if (profile.residencePlan === "outside") {
    checks.push(risk("서울 거주", "신청 시 서울 거주 조건과 맞지 않을 가능성이 있어요", "전입 시점과 신청일을 함께 확인하세요"));
  } else {
    checks.push(verify("서울 거주", "신청 시점의 주민등록 지역을 확인해야 해요", "계약만으로는 부족하고 신청일의 서울 거주 여부를 확인해요"));
  }

  const deposit = Number(home.deposit);
  if (!home.deposit || Number.isNaN(deposit)) {
    checks.push(verify("보증금", "보증금 정보가 없어요", "계약 전 정확한 보증금을 확인하세요"));
    questions.add("이 매물의 정확한 임차보증금은 얼마인가요?");
  } else if (deposit <= 8000) {
    checks.push(matched("보증금", "2026년 서울시 공고의 보증금 기준 안으로 입력했어요", `입력한 보증금 ${deposit.toLocaleString()}만원`));
  } else {
    checks.push(risk("보증금", "2026년 서울시 공고 기준을 넘을 가능성이 있어요", `입력한 보증금 ${deposit.toLocaleString()}만원 · 공고 기준 8,000만원 이하`));
  }

  const rent = Number(home.rent);
  if (!home.rent || Number.isNaN(rent)) {
    checks.push(verify("월세", "월세 정보가 없어요", "관리비를 제외한 순수 월세를 확인하세요"));
    questions.add("관리비를 제외한 순수 월세는 얼마인가요?");
  } else if (rent <= 60) {
    checks.push(matched("월세", "2026년 서울시 공고의 월세 기준 안으로 입력했어요", `입력한 월세 ${rent.toLocaleString()}만원 · 관리비 제외`));
  } else {
    checks.push(risk("월세", "2026년 서울시 공고 기준을 넘을 가능성이 있어요", `입력한 월세 ${rent.toLocaleString()}만원 · 공고 기준 60만원 이하`));
    questions.add("계약서에 월세와 관리비가 각각 얼마로 기재되나요?");
  }

  if (home.moveInRegistration === "yes") {
    checks.push(matched("전입신고", "전입신고 가능으로 확인했어요", "구두 답변에 그치지 말고 계약 전 특약과 건축물 용도도 확인하세요"));
    questions.add("전입신고와 확정일자가 모두 가능한가요?");
  } else if (home.moveInRegistration === "no") {
    checks.push(risk("전입신고", "전입신고가 불가능한 매물이에요", "서울 거주와 임대차 증빙이 필요한 지원에 영향을 줄 수 있어 계약 전에 공식 확인이 필요해요"));
    questions.add("전입신고가 불가능한 정확한 이유는 무엇인가요?");
  } else {
    checks.push(verify("전입신고", "전입신고 가능 여부를 확인하지 못했어요", "지원 신청과 보증금 보호에 영향을 줄 수 있는 핵심 질문이에요"));
    questions.add("이 매물은 전입신고와 확정일자가 가능한가요?");
  }

  if (home.housingType === "unknown") {
    checks.push(verify("주택 형태", "주택 형태를 확인하지 못했어요", "광고에 적힌 명칭과 건축물대장상 용도가 다를 수 있어요"));
    questions.add("이 매물의 건축물대장상 용도는 무엇인가요?");
  } else {
    checks.push(matched("주택 형태", "광고에서 확인한 주택 형태를 입력했어요", "지원 신청 전에는 임대차계약서와 건축물대장 기준으로 다시 확인하세요"));
  }

  questions.add("계약서에 보증금·월세·관리비가 각각 구분되어 기재되나요?");

  const groups = {
    matched: checks.filter((check) => check.tone === "matched"),
    verify: checks.filter((check) => check.tone === "verify"),
    risk: checks.filter((check) => check.tone === "risk"),
  };

  const headline =
    groups.risk.length > 0
      ? "계약 전에 꼭 확인할 조건이 있어요"
      : groups.verify.length > 0
        ? `아직 확인하지 못한 조건이 ${groups.verify.length}개 있어요`
        : "현재 입력에서는 맞는 조건이 많아요";

  const description =
    groups.risk.length > 0
      ? "지원 가능성을 바로 단정하기보다, 아래 조건을 확인한 뒤 후보 집을 판단해보세요."
      : "최종 대상 여부는 신청 시점의 공고와 공식 기관 심사를 통해 결정돼요.";

  return {
    headline,
    description,
    matched: groups.matched,
    verify: groups.verify,
    risk: groups.risk,
    questions: Array.from(questions),
  };
}
