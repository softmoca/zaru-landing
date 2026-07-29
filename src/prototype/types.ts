export type Answer = "yes" | "no" | "unknown";

export type AwarenessLevel =
  | "unselected"
  | "none"
  | "nameOnly"
  | "conditionBasics"
  | "conditionMost";

export type HousingKnowledge =
  | "nationalRent"
  | "seoulRent"
  | "rentHomeConditions"
  | "rentOverlapLimits"
  | "depositInterest"
  | "movingBrokerage"
  | "evidenceRequired"
  | "none";

export type HousingBenefitHistory =
  | "nationalRentCurrent"
  | "nationalRentEnded"
  | "seoulRentCurrent"
  | "seoulRentEnded"
  | "otherRentCurrent"
  | "otherRentEnded"
  | "depositInterest"
  | "movingBrokerage"
  | "none";

export interface PersonalProfile {
  awareness: AwarenessLevel;
  housingKnowledge: HousingKnowledge[];
  ageBand: "unselected" | "national" | "localOnly" | "outside";
  separateFromParents: Answer;
  homeOwnership: Answer;
  incomeCheck: "within" | "outside" | "unknown";
  benefitHistory: HousingBenefitHistory[];
}

export interface CandidateHome {
  nickname: string;
  region: "seoul" | "seongnam" | "otherCapital" | "outside" | "unknown";
  deposit: string;
  rent: string;
  housingType:
    | "studio"
    | "officetel"
    | "villa"
    | "goshiwon"
    | "sharehouse"
    | "other"
    | "unknown";
  moveInRegistration: Answer;
  contractProof: Answer;
  paymentProof: Answer;
  receiptPlan: Answer;
}

export type CheckTone = "matched" | "verify" | "risk";
export type ProgramStatus = "open" | "closed" | "watch";

export interface ConditionCheck {
  label: string;
  summary: string;
  detail: string;
  tone: CheckTone;
}

export interface SupportProgram {
  id: string;
  name: string;
  organizer: string;
  status: ProgramStatus;
  statusLabel: string;
  fit: CheckTone;
  fitLabel: string;
  summary: string;
  reasons: string[];
  actions: string[];
  officialUrl: string;
}

export interface PrototypeResult {
  headline: string;
  description: string;
  awarenessLabel: string;
  knowledgeLabels: string[];
  benefitHistoryLabels: string[];
  programs: SupportProgram[];
  matched: ConditionCheck[];
  verify: ConditionCheck[];
  risk: ConditionCheck[];
  questions: string[];
  evidence: string[];
}

export type CandidateDecision = "keep" | "hold" | "drop" | "undecided" | "";
