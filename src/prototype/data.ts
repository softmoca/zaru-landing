export type StageId = "remote" | "visit" | "contract";
export type CheckStatus = "good" | "caution" | "unknown";

export type ChecklistItem = {
  id: string;
  stage: StageId;
  category: string;
  title: string;
  help: string;
  critical?: boolean;
  custom?: boolean;
  templateId?: string;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  items: ChecklistItem[];
};

export type CheckRecord = {
  status: CheckStatus;
  note: string;
};

export type PropertyRecord = {
  id: string;
  name: string;
  address: string;
  deposit: number;
  rent: number;
  maintenance: number;
  floor: string;
  moveIn: string;
  source: string;
  memo: string;
  accent: "green" | "blue" | "orange" | "purple";
  checks: Record<string, CheckRecord>;
};

export const stageMeta: Record<StageId, { step: string; title: string; short: string; description: string }> = {
  remote: {
    step: "STEP 1",
    title: "온라인·전화 확인",
    short: "가기 전",
    description: "헛걸음을 줄이고, 현장에서 꼭 물을 질문을 준비합니다.",
  },
  visit: {
    step: "STEP 2",
    title: "집에서 직접 확인",
    short: "현장에서",
    description: "사진에 나오지 않는 생활 조건과 하자 흔적을 기록합니다.",
  },
  contract: {
    step: "STEP 3",
    title: "부동산·계약 확인",
    short: "서명 전에",
    description: "권리관계와 계약 문구를 확인하고 증거를 남깁니다.",
  },
};

export const checklist: ChecklistItem[] = [
  // STEP 1 · 온라인/전화
  { id: "remote-address", stage: "remote", category: "매물 기본", title: "정확한 주소·동·호수를 받았다", help: "등기부와 건축물대장을 확인하려면 정확한 주소와 호수가 필요해요.", critical: true },
  { id: "remote-price", stage: "remote", category: "비용", title: "보증금·월세·관리비를 각각 확인했다", help: "광고 가격과 실제 계약 조건이 같은지 다시 물어보세요." },
  { id: "remote-fees", stage: "remote", category: "비용", title: "관리비 포함·별도 항목을 적었다", help: "수도, 전기, 가스, 인터넷, 주차, 청소비를 구분해 기록해요.", critical: true },
  { id: "remote-move", stage: "remote", category: "일정", title: "입주 가능일과 기존 세입자 퇴거일을 확인했다", help: "잔금·입주 일정과 기존 세입자의 퇴거가 맞물리는지 확인해요." },
  { id: "remote-register", stage: "remote", category: "권리·지원", title: "전입신고와 확정일자가 가능하다고 답변받았다", help: "불가능하거나 애매하게 답하면 이유를 구체적으로 기록하세요.", critical: true },
  { id: "remote-support", stage: "remote", category: "권리·지원", title: "대출·보증·주거지원 이용 가능 여부를 물었다", help: "상품별 조건은 다르므로 계약 전 해당 기관에도 다시 확인해야 해요.", critical: true },
  { id: "remote-building", stage: "remote", category: "공적 장부", title: "주택 유형과 위반건축물 여부를 확인할 수 있다", help: "건축물대장의 용도, 동·호수, 위반건축물 표시를 확인할 준비를 해요.", critical: true },
  { id: "remote-owner", stage: "remote", category: "임대인·중개", title: "임대인과 중개사 기본 정보를 받았다", help: "임대인 성명, 중개사무소 명칭과 등록번호를 기록해요." },
  { id: "remote-option", stage: "remote", category: "생활 조건", title: "옵션·반려동물·주차·흡연 조건을 확인했다", help: "말로 허용된 조건은 계약서나 특약에 남길 수 있는지 물어보세요." },
  { id: "remote-viewing", stage: "remote", category: "방문 준비", title: "낮 시간 방문과 재방문이 가능한지 확인했다", help: "채광, 소음, 주변 환경은 가능하면 다른 시간대에도 확인해요." },

  // STEP 2 · 현장 방문
  { id: "visit-sunlight", stage: "visit", category: "채광·환기", title: "창 방향과 실제 채광을 확인했다", help: "방문 시각과 햇빛이 들어오는 위치를 메모해두세요." },
  { id: "visit-window", stage: "visit", category: "채광·환기", title: "창문 개폐·잠금·방충망·외풍을 확인했다", help: "창틀 실리콘 변색과 물자국도 함께 확인해요." },
  { id: "visit-mold", stage: "visit", category: "누수·곰팡이", title: "천장·외벽 모서리·가구 뒤 얼룩을 봤다", help: "새 도배의 이유와 최근 누수·결로 보수 이력을 물어보세요.", critical: true },
  { id: "visit-roof", stage: "visit", category: "누수·곰팡이", title: "최상층·옥상 또는 아래층 외기 노출 여부를 봤다", help: "옥상 방수와 아래층 주차장·필로티는 누수·냉기 질문이 필요한 신호예요." },
  { id: "visit-smell", stage: "visit", category: "누수·곰팡이", title: "하수구·곰팡이·담배 냄새를 확인했다", help: "창문을 닫은 상태와 싱크대·욕실 수납장 안쪽도 확인해요." },
  { id: "visit-water", stage: "visit", category: "수도·배수", title: "싱크대와 샤워 수압·온수를 동시에 틀어봤다", help: "두 곳을 동시에 사용했을 때 수압과 온도 변화를 확인해요." },
  { id: "visit-drain", stage: "visit", category: "수도·배수", title: "세면대·싱크대·욕실 배수 속도를 봤다", help: "물을 충분히 흘려보고 역류나 냄새가 없는지 확인해요." },
  { id: "visit-toilet", stage: "visit", category: "수도·배수", title: "변기 물내림과 누수 흔적을 확인했다", help: "변기 주변 실리콘, 바닥 들뜸과 물자국을 함께 봐요." },
  { id: "visit-noise", stage: "visit", category: "소음·보안", title: "창문을 열고 닫아 외부·복도 소음을 들었다", help: "엘리베이터, 계단, 큰길, 상가, 철도와의 위치를 확인해요." },
  { id: "visit-wall-noise", stage: "visit", category: "소음·보안", title: "벽 두께와 옆집 생활 소음 가능성을 확인했다", help: "벽을 가볍게 두드려보고 중개사에게 민원 이력을 질문해요." },
  { id: "visit-security", stage: "visit", category: "소음·보안", title: "공동현관·도어락·CCTV·창문 방범을 봤다", help: "귀갓길 조명과 외부인이 접근하기 쉬운 구조인지도 확인해요." },
  { id: "visit-power", stage: "visit", category: "설비·옵션", title: "콘센트·조명·차단기 위치를 확인했다", help: "가구 배치에 필요한 콘센트 수와 고장 여부를 봐요." },
  { id: "visit-options", stage: "visit", category: "설비·옵션", title: "에어컨·보일러·세탁기·냉장고를 작동해봤다", help: "옵션의 제조연도, 소음, 냄새와 수리 책임을 기록해요." },
  { id: "visit-heating", stage: "visit", category: "설비·옵션", title: "난방 방식과 보일러 상태를 확인했다", help: "개별·중앙난방 여부와 최근 사용료를 물어보세요." },
  { id: "visit-mobile", stage: "visit", category: "생활", title: "휴대전화 수신과 인터넷 설치 가능 여부를 봤다", help: "방 안쪽과 화장실에서도 데이터가 잡히는지 확인해요." },
  { id: "visit-size", stage: "visit", category: "생활", title: "가구가 들어갈 실측 치수를 기록했다", help: "침대, 책상, 냉장고, 세탁기와 출입문 폭까지 재보세요." },
  { id: "visit-common", stage: "visit", category: "공용 공간", title: "쓰레기·택배·주차·엘리베이터 공간을 봤다", help: "관리 상태와 밤에 이용할 동선을 함께 확인해요." },
  { id: "visit-photo", stage: "visit", category: "기록", title: "허락을 받고 사진·영상과 질문 답변을 남겼다", help: "나중에 매물을 비교할 수 있도록 같은 순서로 촬영해요." },

  // STEP 3 · 계약
  { id: "contract-registry", stage: "contract", category: "권리관계", title: "서명 직전 최신 등기부를 다시 확인했다", help: "소유자, 근저당, 압류, 가압류 등 변동이 없는지 확인해요.", critical: true },
  { id: "contract-owner", stage: "contract", category: "권리관계", title: "등기상 소유자와 계약자가 일치한다", help: "대리 계약이면 위임장, 인감증명서와 임대인 본인 확인이 필요해요.", critical: true },
  { id: "contract-building", stage: "contract", category: "공적 장부", title: "건축물대장의 주소·용도·동호수가 일치한다", help: "위반건축물 표시와 실제 사용하는 공간이 장부와 같은지 확인해요.", critical: true },
  { id: "contract-tax", stage: "contract", category: "권리관계", title: "임대인 세금 체납과 선순위 보증금을 확인했다", help: "확인 방법과 필요한 동의·서류는 계약 전 HUG 등 공식 기관에 문의하세요.", critical: true },
  { id: "contract-guarantee", stage: "contract", category: "보증·대출", title: "보증·대출 심사 가능 여부를 해당 기관에 확인했다", help: "중개사의 답변만으로 확정하지 말고 기관의 심사 기준을 확인해요.", critical: true },
  { id: "contract-standard", stage: "contract", category: "계약서", title: "주택임대차표준계약서를 기준으로 검토했다", help: "목적물, 금액, 기간, 지급일과 당사자 정보를 한 줄씩 확인해요." },
  { id: "contract-address", stage: "contract", category: "계약서", title: "계약서 주소·동·층·호수가 장부와 정확히 같다", help: "다가구·다세대와 호수 표기가 애매하면 서명 전에 바로잡아요.", critical: true },
  { id: "contract-money", stage: "contract", category: "계약서", title: "보증금·월세·관리비·지급일이 합의와 같다", help: "관리비 포함 항목과 정산 방식도 확인설명서·특약에 남겨요." },
  { id: "contract-repair", stage: "contract", category: "특약", title: "확인된 하자와 수리 기한·책임을 특약에 적었다", help: "누수, 곰팡이, 옵션 고장 등 구두 약속은 문장으로 구체화해요." },
  { id: "contract-loan-clause", stage: "contract", category: "특약", title: "보증·대출 불가 시 처리 조건을 합의했다", help: "반환 범위와 귀책 사유를 당사자와 전문가에게 확인해 특약으로 남겨요." },
  { id: "contract-right-clause", stage: "contract", category: "특약", title: "잔금·전입 전 권리변동 방지 조건을 검토했다", help: "새 담보권 설정 등 위험을 막는 문구는 전문가와 함께 정확히 작성해요." },
  { id: "contract-account", stage: "contract", category: "지급·증거", title: "임대인 명의 계좌로 이체하고 내역을 남겼다", help: "현금보다 이체 기록을 남기고 수령인 명의가 다르면 이유를 확인해요.", critical: true },
  { id: "contract-agent", stage: "contract", category: "중개", title: "중개사 등록과 손해배상책임 보장서를 확인했다", help: "중개대상물 확인·설명서와 공제증서 내용을 함께 받아요." },
  { id: "contract-docs", stage: "contract", category: "지급·증거", title: "계약서·확인설명서·공제증서 사본을 받았다", help: "수정된 부분에는 당사자의 확인이 있는지 보고 파일로도 보관해요." },
  { id: "contract-report", stage: "contract", category: "계약 후 일정", title: "임대차 신고와 확정일자 계획을 확인했다", help: "대상 계약은 계약일로부터 정해진 기간 안에 신고해야 하며 전자계약은 일부 절차가 자동 연계돼요." },
  { id: "contract-movein", stage: "contract", category: "계약 후 일정", title: "잔금·열쇠·전입신고·입주 기록 일정을 적었다", help: "입주일에는 집 상태, 계량기, 열쇠와 옵션 상태를 사진으로 남길 계획을 세워요." },
];

export const initialTemplates: ChecklistTemplate[] = [
  {
    id: "my-lifestyle",
    name: "나의 생활 기준",
    description: "늦은 귀가와 실제 생활 동선까지 꼭 확인하는 나만의 체크예요.",
    enabled: true,
    items: [
      {
        id: "custom-my-lifestyle-night-route",
        stage: "visit",
        category: "나의 생활 기준",
        title: "밤 10시 귀갓길의 조명과 유동 인구를 확인했다",
        help: "낮 방문만 했다면 지도와 로드뷰로 먼저 보고, 가능하면 밤에도 다시 걸어보세요.",
        custom: true,
        templateId: "my-lifestyle",
      },
      {
        id: "custom-my-lifestyle-walk",
        stage: "visit",
        category: "나의 생활 기준",
        title: "자주 가는 역까지 실제로 걸어봤다",
        help: "신호 대기, 언덕, 큰길 횡단까지 포함한 체감 시간을 기록해요.",
        custom: true,
        templateId: "my-lifestyle",
      },
      {
        id: "custom-my-lifestyle-trash",
        stage: "remote",
        category: "나의 생활 기준",
        title: "분리수거 요일과 배출 장소를 물었다",
        help: "배출 시간과 음식물 쓰레기 처리 방식도 함께 확인해두세요.",
        custom: true,
        templateId: "my-lifestyle",
      },
    ],
  },
];

function records(entries: Array<[string, CheckStatus, string?]>): Record<string, CheckRecord> {
  return Object.fromEntries(entries.map(([id, status, note = ""]) => [id, { status, note }]));
}

export const initialProperties: PropertyRecord[] = [
  {
    id: "seongsu-201",
    name: "성수동 햇살 원룸",
    address: "서울 성동구 성수동2가 · 201호",
    deposit: 1000,
    rent: 65,
    maintenance: 8,
    floor: "4층 / 4층",
    moveIn: "8월 18일",
    source: "직방",
    memo: "회사와 가장 가깝지만 최상층 누수 이력 재확인 필요",
    accent: "orange",
    checks: records([
      ["remote-address", "good"], ["remote-price", "good"], ["remote-fees", "caution", "인터넷 2만 원 별도"],
      ["remote-move", "good"], ["remote-register", "good"], ["remote-support", "unknown"],
      ["remote-building", "good"], ["remote-owner", "good"], ["remote-option", "good"], ["remote-viewing", "good"],
      ["visit-sunlight", "good", "오후 2시 채광 좋음"], ["visit-window", "good"],
      ["visit-mold", "caution", "천장 한쪽만 새 도배"], ["visit-roof", "caution", "옥상 바로 아래"],
      ["visit-water", "good"], ["visit-drain", "good"], ["visit-noise", "good"], ["visit-options", "caution", "에어컨 소음"],
    ]),
  },
  {
    id: "mangwon-a",
    name: "망원동 조용한 투룸",
    address: "서울 마포구 망원동 · A호",
    deposit: 2000,
    rent: 72,
    maintenance: 5,
    floor: "2층 / 5층",
    moveIn: "즉시",
    source: "네이버부동산",
    memo: "넓고 조용함. 보증금과 출퇴근 거리 때문에 비교 필요",
    accent: "green",
    checks: records([
      ["remote-address", "good"], ["remote-price", "good"], ["remote-fees", "good"], ["remote-move", "good"],
      ["remote-register", "good"], ["remote-support", "good"], ["remote-building", "good"], ["remote-owner", "good"],
      ["remote-option", "caution", "반려동물 불가"], ["remote-viewing", "good"],
      ["visit-sunlight", "good"], ["visit-window", "good"], ["visit-mold", "good"], ["visit-roof", "good"],
      ["visit-smell", "good"], ["visit-water", "good"], ["visit-drain", "good"], ["visit-toilet", "good"],
      ["visit-noise", "good"], ["visit-wall-noise", "good"], ["visit-security", "caution", "골목이 어두움"],
      ["visit-power", "good"], ["visit-options", "good"], ["visit-mobile", "good"], ["visit-size", "good"], ["visit-photo", "good"],
      ["contract-registry", "good"], ["contract-owner", "good"], ["contract-building", "good"], ["contract-tax", "unknown"],
    ]),
  },
  {
    id: "sillim-b1",
    name: "신림동 가성비 원룸",
    address: "서울 관악구 신림동 · B01호",
    deposit: 500,
    rent: 55,
    maintenance: 12,
    floor: "반지하 / 4층",
    moveIn: "9월 1일",
    source: "다방",
    memo: "월세는 저렴하지만 관리비와 습기 리스크가 큼",
    accent: "purple",
    checks: records([
      ["remote-address", "good"], ["remote-price", "good"], ["remote-fees", "caution", "관리비 12만 원, 항목 불명확"],
      ["remote-move", "good"], ["remote-register", "good"], ["remote-support", "unknown"], ["remote-building", "unknown"],
      ["visit-sunlight", "caution", "낮에도 조명 필요"], ["visit-window", "caution"], ["visit-mold", "caution", "붙박이장 냄새"],
      ["visit-smell", "caution", "욕실 하수 냄새"], ["visit-water", "good"], ["visit-drain", "caution"],
      ["visit-noise", "good"], ["visit-security", "caution", "창문이 골목 높이"], ["visit-options", "good"], ["visit-mobile", "caution"],
    ]),
  },
];

export const officialSources = [
  { label: "HUG 안심전세 · 셀프 체크리스트", href: "https://onestop.khug.or.kr/" },
  { label: "HUG · 전세사기 예방 안전계약 컨설팅", href: "https://www.khug.or.kr/jeonse/web/s04/s040005.jsp" },
  { label: "국토교통부 · 부동산거래 전자계약 절차", href: "https://irts.molit.go.kr/usr/cmn/main/home/RtecsHelp.do" },
  { label: "국가법령정보센터 · 주택임대차보호법", href: "https://www.law.go.kr/법령/주택임대차보호법" },
];
