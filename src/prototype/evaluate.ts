import type {
  CandidateHome,
  CheckTone,
  ConditionCheck,
  HousingBenefitHistory,
  HousingKnowledge,
  PersonalProfile,
  PrototypeResult,
  SupportProgram,
} from "./types";

const URLS = {
  nationalRent:
    "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004661&wlfareInfoReldBztpCd=01",
  seoulRent: "https://housing.seoul.go.kr/site/main/content/sh01_060513?tr_code=short",
  seoulDeposit: "https://housing.seoul.go.kr/site/main/content/sh01_040901",
  seoulMoving:
    "https://youth.seoul.go.kr/infoData/sprtInfo/view.do?key=2309130006&sprtInfoId=68910",
  seongnam:
    "https://dept.seongnam.go.kr/youth/apply/business/detail/187",
};

const AWARENESS_LABELS: Record<PersonalProfile["awareness"], string> = {
  unselected: "사용 전 인지 수준을 선택하지 않았어요",
  none: "주거지원 제도를 몰랐어요",
  nameOnly: "청년월세지원 이름만 들어봤어요",
  conditionBasics: "청년월세지원에 조건이 있다는 정도만 알고 있었어요",
  conditionMost: "청년월세지원의 주요 조건을 대부분 알고 있었어요",
};

const KNOWLEDGE_LABELS: Record<HousingKnowledge, string> = {
  nationalRent: "복지로(전국) 청년월세지원",
  seoulRent: "서울시 청년월세지원",
  rentHomeConditions: "매물 조건에 따라 월세지원 가능성이 달라진다는 점",
  rentOverlapLimits:
    "동시 수급은 불가하지만, 다른 월세지원 종료 후에는 신청 가능한 경우가 있다는 점",
  depositInterest: "청년 임차보증금 이자지원",
  movingBrokerage: "중개보수·이사비 지원",
  evidenceRequired: "계약서·납부내역·영수증 같은 증빙이 필요하다는 점",
  none: "위 항목 중 알고 있던 내용 없음",
};

const BENEFIT_HISTORY_LABELS: Record<HousingBenefitHistory, string> = {
  nationalRentCurrent: "복지로(전국) 청년월세지원 · 현재 수혜 중",
  nationalRentEnded: "복지로(전국) 청년월세지원 · 수혜 종료",
  seoulRentCurrent: "서울시 청년월세지원 · 현재 수혜 중",
  seoulRentEnded: "서울시 청년월세지원 · 수혜 종료",
  otherRentCurrent: "그 외 지자체 월세지원 · 현재 수혜 중",
  otherRentEnded: "그 외 지자체 월세지원 · 수혜 종료",
  depositInterest: "청년 임차보증금 이자지원 수혜 경험",
  movingBrokerage: "중개보수·이사비 지원 수혜 경험",
  none: "받은 주거혜택 없음",
};

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

function fitFrom(values: CheckTone[]): CheckTone {
  if (values.includes("risk")) return "risk";
  if (values.includes("verify")) return "verify";
  return "matched";
}

function program(
  data: Omit<SupportProgram, "fitLabel"> & { fitLabel?: string }
): SupportProgram {
  const fitLabels: Record<CheckTone, string> = {
    matched: "확인해볼 가능성 있음",
    verify: "추가 확인 필요",
    risk: "현재 조건과 맞지 않을 가능성",
  };
  return { ...data, fitLabel: data.fitLabel ?? fitLabels[data.fit] };
}

function ageFit(profile: PersonalProfile, nationalOnly = false): CheckTone {
  if (profile.ageBand === "unselected") return "verify";
  if (profile.ageBand === "outside") return "risk";
  if (nationalOnly && profile.ageBand === "localOnly") return "risk";
  return "matched";
}

function hasBenefit(
  profile: PersonalProfile,
  ...values: HousingBenefitHistory[]
): boolean {
  return values.some((value) => profile.benefitHistory.includes(value));
}

function nationalHistoryFit(profile: PersonalProfile): CheckTone {
  if (
    hasBenefit(
      profile,
      "nationalRentCurrent",
      "seoulRentCurrent",
      "otherRentCurrent"
    )
  ) {
    return "risk";
  }
  if (hasBenefit(profile, "nationalRentEnded")) return "verify";
  return "matched";
}

function seoulHistoryFit(profile: PersonalProfile): CheckTone {
  if (
    hasBenefit(
      profile,
      "nationalRentCurrent",
      "seoulRentCurrent",
      "seoulRentEnded",
      "otherRentCurrent"
    )
  ) {
    return "risk";
  }
  return "matched";
}

function commonFit(profile: PersonalProfile): CheckTone[] {
  return [
    profile.homeOwnership === "no"
      ? "matched"
      : profile.homeOwnership === "yes"
        ? "risk"
        : "verify",
    profile.incomeCheck === "within"
      ? "matched"
      : profile.incomeCheck === "outside"
        ? "risk"
        : "verify",
  ];
}

export function evaluateCandidate(
  profile: PersonalProfile,
  home: CandidateHome
): PrototypeResult {
  const checks: ConditionCheck[] = [];
  const questions = new Set<string>();
  const evidence = new Set<string>();
  const programs: SupportProgram[] = [];
  const deposit = Number(home.deposit);
  const rent = Number(home.rent);

  if (profile.ageBand === "national") {
    checks.push(matched("연령", "전국·서울·성남 청년지원의 주요 연령 구간에 들어요", "1991년~2007년 출생으로 입력했어요"));
  } else if (profile.ageBand === "localOnly") {
    checks.push(verify("연령", "서울·성남 지원은 확인할 수 있지만 전국 청년월세 기준은 다를 수 있어요", "1986년~1990년 출생으로 입력했어요"));
  } else if (profile.ageBand === "outside") {
    checks.push(risk("연령", "이번에 확인하는 청년지원 연령 범위를 벗어날 가능성이 있어요", "연령 제한이 다른 지역 사업을 별도로 확인하세요"));
  } else {
    checks.push(verify("연령", "출생연도 확인이 필요해요", "지원마다 19~34세 또는 19~39세처럼 기준이 달라요"));
  }

  if (profile.homeOwnership === "no") {
    checks.push(matched("무주택 여부", "무주택으로 입력했어요", "최종 심사에서는 주택·분양권 등의 범위를 다시 확인해요"));
  } else if (profile.homeOwnership === "yes") {
    checks.push(risk("무주택 여부", "주택을 소유한 경우 여러 지원이 어려울 수 있어요", "지원별 주택 소유 판단 범위를 공식 공고에서 확인하세요"));
  } else {
    checks.push(verify("무주택 여부", "주택 소유 여부를 확인하지 못했어요", "본인 명의 주택·분양권 등을 확인하세요"));
  }

  if (profile.incomeCheck === "within") {
    checks.push(matched("소득 기준", "본인이 확인한 소득 기준 안으로 입력했어요", "지원별 가구 범위와 심사 방식은 달라질 수 있어요"));
  } else if (profile.incomeCheck === "outside") {
    checks.push(risk("소득 기준", "일부 지원의 소득 기준을 벗어날 가능성이 있어요", "건강보험료·원가구·청년가구 기준을 따로 확인하세요"));
  } else {
    checks.push(verify("소득 기준", "소득 기준을 아직 확인하지 않았어요", "전국 지원과 지역 지원은 가구와 소득을 다르게 볼 수 있어요"));
  }

  if (profile.benefitHistory.includes("none")) {
    checks.push(matched("주거혜택 이력", "받은 주거혜택이 없다고 입력했어요", "최종 신청 때는 가족이 대신 신청한 지원도 함께 확인해요"));
  } else if (
    hasBenefit(
      profile,
      "nationalRentCurrent",
      "seoulRentCurrent",
      "otherRentCurrent"
    )
  ) {
    checks.push(verify("주거혜택 이력", "현재 받고 있는 월세지원이 있어요", "월세지원은 동시에 받을 수 없지만, 기존 지원이 끝난 뒤 다른 지원을 확인할 수 있어요"));
  } else {
    checks.push(matched("주거혜택 이력", "이전에 받은 지원의 종류와 종료 여부를 기록했어요", "같은 사업의 재신청 제한과 다른 사업의 신청 가능성을 각각 확인해요"));
  }

  if (home.region === "seoul") {
    checks.push(matched("후보 집 지역", "서울의 전국·서울시 지원을 함께 확인해요", "신청 시 실제 거주와 주민등록 조건도 확인해야 해요"));
  } else if (home.region === "seongnam") {
    checks.push(matched("후보 집 지역", "성남의 전국·성남시 지원을 함께 확인해요", "성남시 사업은 취·창업 여부 등 별도 조건이 있어요"));
  } else if (home.region === "unknown") {
    checks.push(verify("후보 집 지역", "지역을 확인하지 못했어요", "지역에 따라 월세·보증금·이사비 지원이 달라져요"));
  } else {
    checks.push(verify("후보 집 지역", "이번 프로토타입에 등록되지 않은 지역이에요", "전국 지원과 후보 집 지자체의 청년포털을 함께 확인하세요"));
  }

  if (!home.deposit || Number.isNaN(deposit)) {
    checks.push(verify("보증금", "보증금 정보가 없어요", "계약 전 정확한 임차보증금을 확인하세요"));
    questions.add("이 매물의 정확한 임차보증금은 얼마인가요?");
  } else {
    checks.push(matched("보증금", "후보 집의 보증금을 기록했어요", `입력한 보증금 ${deposit.toLocaleString()}만원 · 지원별 상한은 공식 공고에서 비교해요`));
  }

  if (!home.rent || Number.isNaN(rent)) {
    checks.push(verify("월세", "월세 정보가 없어요", "관리비를 제외한 순수 월세를 확인하세요"));
    questions.add("관리비를 제외한 순수 월세는 얼마인가요?");
  } else {
    checks.push(matched("월세", "후보 집의 월세를 기록했어요", `입력한 월세 ${rent.toLocaleString()}만원 · 관리비와 구분해 확인해요`));
  }

  if (home.moveInRegistration === "yes") {
    checks.push(matched("전입신고", "전입신고 가능으로 확인했어요", "구두 답변뿐 아니라 계약서와 실제 전입 가능 시점을 확인하세요"));
    questions.add("전입신고와 확정일자가 모두 가능한가요?");
  } else if (home.moveInRegistration === "no") {
    checks.push(risk("전입신고", "전입신고가 불가능하다고 들었어요", "거주지 일치가 필요한 지원과 보증금 보호 절차에 영향을 줄 수 있어요"));
    questions.add("전입신고가 불가능한 정확한 이유와 건축물대장상 용도는 무엇인가요?");
  } else {
    checks.push(verify("전입신고", "전입신고 가능 여부를 확인하지 못했어요", "일부 지원은 실제 거주지와 주민등록 주소 일치를 요구해요"));
    questions.add("이 매물은 전입신고와 확정일자가 가능한가요?");
  }

  if (home.housingType === "goshiwon") {
    checks.push(verify("고시원 증빙", "고시원이라고 모든 지원에서 제외되는 것은 아니에요", "전입신고·입실확인서·월세 납부 증빙 가능 여부를 지원별로 확인해야 해요"));
    questions.add("입실확인서 또는 임대차계약서를 발급받을 수 있나요?");
    questions.add("월세를 계좌이체하고 납부확인서를 받을 수 있나요?");
  } else if (home.housingType === "unknown") {
    checks.push(verify("주택 형태", "주택 형태를 확인하지 못했어요", "광고 명칭과 건축물대장상 용도가 다를 수 있어요"));
    questions.add("이 매물의 건축물대장상 용도는 무엇인가요?");
  } else {
    checks.push(matched("주택 형태", "광고에서 확인한 주택 형태를 입력했어요", "지원 신청 전 계약서와 건축물대장 기준으로 다시 확인하세요"));
  }

  if (home.contractProof === "yes") {
    checks.push(matched("계약 증빙", "계약서나 입실확인서를 받을 수 있어요", "주소·보증금·월세가 구분되어 적히는지 확인하세요"));
  } else if (home.contractProof === "no") {
    checks.push(risk("계약 증빙", "계약 또는 입실 증빙을 받기 어려워요", "지원 신청과 분쟁 대응에 필요한 증빙을 남기기 어려울 수 있어요"));
    questions.add("계약 내용과 주소가 적힌 계약서 또는 입실확인서를 발급할 수 있나요?");
  } else {
    checks.push(verify("계약 증빙", "계약서·입실확인서 발급 여부를 확인하지 못했어요", "고시원은 입실확인서처럼 다른 증빙이 필요한 경우가 있어요"));
    questions.add(
      home.housingType === "goshiwon"
        ? "입실확인서 또는 임대차계약서를 발급받을 수 있나요?"
        : "임대차계약서를 발급받을 수 있나요?"
    );
  }

  if (home.paymentProof === "yes") {
    checks.push(matched("월세 증빙", "월세 납부 기록을 남길 수 있어요", "계좌이체 내역과 영수증을 보관하세요"));
  } else if (home.paymentProof === "no") {
    checks.push(risk("월세 증빙", "월세 납부 기록을 남기기 어려워요", "현금 납부 시 공식 납부확인서 발급 가능 여부를 확인하세요"));
    questions.add("월세 납부확인서나 현금영수증을 받을 수 있나요?");
  } else {
    checks.push(verify("월세 증빙", "월세 납부 증빙 방식을 확인하지 못했어요", "계좌이체 내역이나 월차임 납부확인서를 남길 수 있는지 확인하세요"));
    questions.add("월세는 어떤 방식으로 내고 납부 증빙을 받을 수 있나요?");
  }

  if (home.receiptPlan !== "yes") {
    checks.push(verify("이사·중개비 증빙", "중개보수와 이사비 영수증을 받을 수 있는지 확인하세요", "지역 이사비 지원은 실제 지출 증빙을 요구할 수 있어요"));
    questions.add("중개보수 현금영수증 또는 카드 영수증을 발급받을 수 있나요?");
  } else {
    checks.push(matched("이사·중개비 증빙", "영수증을 남길 예정이에요", "중개업소·이사업체 상호와 금액이 표시된 증빙을 보관하세요"));
  }

  evidence.add(home.housingType === "goshiwon" ? "입실확인서 또는 임대차계약서" : "임대차계약서");
  evidence.add("전입신고와 주민등록 주소");
  evidence.add("월세 계좌이체 내역 또는 납부확인서");
  evidence.add("중개보수 영수증");
  evidence.add("이사업체 영수증 또는 계약서");

  const nationalFit = fitFrom([
    ageFit(profile, true),
    nationalHistoryFit(profile),
    ...commonFit(profile),
    profile.separateFromParents === "yes"
      ? "matched"
      : profile.separateFromParents === "no"
        ? "risk"
        : "verify",
    home.moveInRegistration === "no" ? "risk" : home.moveInRegistration === "unknown" ? "verify" : "matched",
    home.contractProof === "no" ? "risk" : home.contractProof === "unknown" ? "verify" : "matched",
    home.paymentProof === "no" ? "risk" : home.paymentProof === "unknown" ? "verify" : "matched",
  ]);
  programs.push(
    program({
      id: "national-rent-2026",
      name: "2026 청년월세지원",
      organizer: "국토교통부 · 복지로",
      status: "closed",
      statusLabel: "2026 모집 마감 · 다음 공고 확인",
      fit: nationalFit,
      summary: "월 최대 20만원, 최대 24회 지원하는 전국 단위 월세지원",
      reasons: [
        profile.ageBand === "localOnly"
          ? "전국 지원은 19~34세 기준이라 1986~1990년 출생 구간은 연령 조건과 맞지 않아요."
          : "전국 지원은 19~34세 청년이 확인할 수 있는 월세지원이에요.",
        hasBenefit(profile, "nationalRentCurrent", "seoulRentCurrent", "otherRentCurrent")
          ? "현재 다른 월세지원을 받고 있다면 동시에 받을 수 없고, 수혜 종료 뒤 신청 가능성을 다시 확인해야 해요."
          : hasBenefit(profile, "nationalRentEnded")
            ? "전국 지원을 이미 24개월 모두 받았다면 다시 신청할 수 없어요. 일부만 받았다면 남은 기간 재개 가능성을 확인하세요."
            : hasBenefit(profile, "seoulRentEnded", "otherRentEnded")
              ? "다른 월세지원 수혜가 끝났다면 전국 지원 신청 가능성을 확인할 수 있어요."
              : "부모와 별도 거주·무주택·소득·임대차 증빙을 함께 확인해요.",
      ],
      actions: [
        profile.ageBand === "localOnly"
          ? "19~39세까지 가능한 서울시·지역 월세지원 확인"
          : hasBenefit(profile, "nationalRentEnded")
            ? "전국 지원의 기존 수혜 개월과 남은 지원 기간 확인"
            : hasBenefit(profile, "seoulRentCurrent", "otherRentCurrent")
              ? "현재 지원의 종료일과 다음 전국 지원 공고 확인"
              : profile.separateFromParents === "unknown"
                ? "부모와 별도 거주 기준 확인"
                : "원가구·청년가구 소득 기준 확인",
        home.contractProof !== "yes" ? "계약 또는 입실 증빙 가능 여부 확인" : "계약 증빙 보관",
      ],
      officialUrl: URLS.nationalRent,
    })
  );

  if (home.region === "seoul") {
    const seoulRentFit = fitFrom([
      ageFit(profile),
      seoulHistoryFit(profile),
      ...commonFit(profile),
      deposit > 8000 ? "risk" : "matched",
      rent > 60 ? "verify" : "matched",
      home.moveInRegistration === "yes" ? "matched" : home.moveInRegistration === "no" ? "risk" : "verify",
    ]);
    programs.push(
      program({
        id: "seoul-rent-2026",
        name: "서울시 청년월세지원",
        organizer: "서울특별시",
        status: "closed",
        statusLabel: "2026 모집 마감 · 다음 공고 확인",
        fit: seoulRentFit,
        summary: "서울 거주 청년에게 월 최대 20만원, 최대 12개월을 지원한 사업",
        reasons: [
          "후보 집이 서울에 있어 지역 지원을 함께 확인해요.",
          hasBenefit(profile, "seoulRentCurrent", "seoulRentEnded")
            ? "서울시 청년월세지원에 이전에 선정됐다면 수혜 종료 후에도 다시 신청할 수 없어요."
            : hasBenefit(profile, "nationalRentCurrent", "otherRentCurrent")
              ? "현재 다른 월세지원을 받고 있다면 동시에 받을 수 없고, 수혜 종료 뒤 신청 가능성을 확인해야 해요."
              : hasBenefit(profile, "nationalRentEnded", "otherRentEnded")
                ? "다른 월세지원 수혜가 끝났다면 서울시 지원 신청 가능성을 확인할 수 있어요."
                : "신청 시 임차주택 주소와 주민등록·실거주지가 일치해야 해요.",
        ],
        actions: [
          home.moveInRegistration !== "yes" ? "전입신고 가능 여부 확인" : "신청 시점 주민등록 주소 확인",
          home.housingType === "goshiwon" ? "입실확인서·월차임 납부확인서 준비 가능 여부 확인" : "임대차계약서와 월세 이체 내역 보관",
        ],
        officialUrl: URLS.seoulRent,
      })
    );

    const depositFit = fitFrom([
      ageFit(profile),
      profile.homeOwnership === "no" ? "matched" : profile.homeOwnership === "yes" ? "risk" : "verify",
      home.housingType === "goshiwon" ? "risk" : home.housingType === "unknown" ? "verify" : "matched",
    ]);
    programs.push(
      program({
        id: "seoul-deposit-interest",
        name: "서울시 청년 임차보증금 이자지원",
        organizer: "서울특별시 · 하나은행",
        status: "open",
        statusLabel: "현재 신규 신청 경로 확인 가능",
        fit: depositFit,
        summary: "서울 청년의 임차보증금 대출과 이자를 지원하는 사업",
        reasons: [
          "계약 전에 대상 주택과 대출 가능 여부를 확인할 수 있는 지원이에요.",
          "근로청년·취업준비생 여부와 소득, 대상 주택을 함께 심사해요.",
        ],
        actions: [
          "계약 전에 하나은행에서 대출 가능 여부와 한도 조회",
          "후보 집이 대상 주택에 해당하는지 공식 공고 확인",
        ],
        officialUrl: URLS.seoulDeposit,
      })
    );

    programs.push(
      program({
        id: "seoul-moving-2026",
        name: "서울시 청년 중개보수·이사비 지원",
        organizer: "서울특별시",
        status: "watch",
        statusLabel: "2026 상반기 마감 · 다음 모집 확인",
        fit: fitFrom([
          ageFit(profile),
          profile.homeOwnership === "no" ? "matched" : profile.homeOwnership === "yes" ? "risk" : "verify",
          home.receiptPlan === "yes" ? "matched" : "verify",
        ]),
        summary: "중개보수와 이사비를 최대 40만원 한도에서 실비 지원한 사업",
        reasons: [
          "서울로 전입하거나 서울 안에서 이사하는 청년이 확인할 수 있어요.",
          "계약 후가 아니라 계약할 때부터 영수증을 남겨야 해요.",
        ],
        actions: [
          "중개보수 영수증 발급 요청",
          "이사업체 상호·금액이 적힌 영수증 또는 계약서 보관",
        ],
        officialUrl: URLS.seoulMoving,
      })
    );
  } else if (home.region === "seongnam") {
    const seongnamFit = fitFrom([
      ageFit(profile),
      profile.homeOwnership === "no" ? "matched" : profile.homeOwnership === "yes" ? "risk" : "verify",
      profile.separateFromParents === "yes"
        ? "matched"
        : profile.separateFromParents === "no"
          ? "risk"
          : "verify",
      "verify",
    ]);
    programs.push(
      program({
        id: "seongnam-youth-housing-2026",
        name: "성남시 취업청년 전·월세·이사비 지원",
        organizer: "성남시",
        status: "closed",
        statusLabel: "2026 모집 마감 · 다음 공고 확인",
        fit: seongnamFit,
        summary: "월세·전세보증금 대출이자·중개비·이사비를 묶어 지원한 성남시 사업",
        reasons: [
          "후보 집이 성남에 있어 지역 묶음 지원을 확인해요.",
          "부모와 별도 거주하는 무주택 취·창업 청년이 주요 대상이에요.",
        ],
        actions: [
          "취·창업 및 소득 증빙 준비",
          "전입 주소와 중개보수·이사비 영수증 보관",
        ],
        officialUrl: URLS.seongnam,
      })
    );
  } else if (home.region !== "unknown") {
    programs.push(
      program({
        id: "local-policy-search",
        name: "후보 지역 청년주거지원",
        organizer: "후보 집 관할 지자체",
        status: "watch",
        statusLabel: "지역 공식 공고 확인 필요",
        fit: "verify",
        summary: "지역별 월세·보증금·이사비 지원은 대상과 모집 시기가 달라요.",
        reasons: ["이번 프로토타입에는 서울·성남 지역 정책만 등록되어 있어요."],
        actions: ["후보 집 시·군·구 청년포털에서 주거지원 검색"],
        officialUrl: "https://www.myhome.go.kr/",
      })
    );
  }

  const groups = {
    matched: checks.filter((check) => check.tone === "matched"),
    verify: checks.filter((check) => check.tone === "verify"),
    risk: checks.filter((check) => check.tone === "risk"),
  };
  const actionablePrograms = programs.filter((item) => item.fit !== "risk").length;
  const headline = `이 집에서 확인할 지원 후보가 ${actionablePrograms}개 있어요`;
  const description =
    groups.risk.length > 0
      ? "월세만 비교하기 전에 전입신고·계약 증빙·지원 상태까지 함께 확인해보세요."
      : "현재 입력과 관련 있는 지원과 계약 전 준비 행동을 모았어요.";

  return {
    headline,
    description,
    awarenessLabel: AWARENESS_LABELS[profile.awareness],
    knowledgeLabels: profile.housingKnowledge.map((item) => KNOWLEDGE_LABELS[item]),
    benefitHistoryLabels: profile.benefitHistory.map(
      (item) => BENEFIT_HISTORY_LABELS[item]
    ),
    programs,
    matched: groups.matched,
    verify: groups.verify,
    risk: groups.risk,
    questions: Array.from(questions),
    evidence: Array.from(evidence),
  };
}
