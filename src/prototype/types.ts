export type Answer = "yes" | "no" | "unknown";

export interface PersonalProfile {
  ageBand: "eligible" | "outside" | "unknown";
  residencePlan: "seoul" | "outside" | "unknown";
  homeOwnership: Answer;
  incomeCheck: "within" | "outside" | "unknown";
  previousSupport: Answer;
}

export interface CandidateHome {
  nickname: string;
  region: "seoul" | "capital" | "outside" | "unknown";
  deposit: string;
  rent: string;
  housingType: "studio" | "officetel" | "villa" | "goshiwon" | "other" | "unknown";
  moveInRegistration: Answer;
}

export type CheckTone = "matched" | "verify" | "risk";

export interface ConditionCheck {
  label: string;
  summary: string;
  detail: string;
  tone: CheckTone;
}

export interface PrototypeResult {
  headline: string;
  description: string;
  matched: ConditionCheck[];
  verify: ConditionCheck[];
  risk: ConditionCheck[];
  questions: string[];
}

export type CandidateDecision = "keep" | "hold" | "drop" | "undecided" | "";
