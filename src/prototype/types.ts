export type Answer = "yes" | "no" | "unknown";

export type AwarenessLevel =
  | "none"
  | "nameOnly"
  | "checkedMine"
  | "checkedHome"
  | "applied";

export interface PersonalProfile {
  awareness: AwarenessLevel;
  ageBand: "national" | "localOnly" | "outside" | "unknown";
  separateFromParents: Answer;
  homeOwnership: Answer;
  incomeCheck: "within" | "outside" | "unknown";
  employment: "employed" | "startup" | "jobseeker" | "student" | "other" | "unknown";
  previousSupport: Answer;
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
  programs: SupportProgram[];
  matched: ConditionCheck[];
  verify: ConditionCheck[];
  risk: ConditionCheck[];
  questions: string[];
  evidence: string[];
}

export type CandidateDecision = "keep" | "hold" | "drop" | "undecided" | "";
