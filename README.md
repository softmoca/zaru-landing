# 자루(자취루틴) 랜딩페이지

자취 청소·관리 **주기를 잡아주고 알림으로 재방문을 유도**하는 루틴 관리 앱, "자루"의 사전예약 랜딩페이지입니다.

## 목적

- "이런 서비스 나오면 쓸래?"를 던지고 **사전예약**을 수집
- 검증 대상 가설: **"청소·관리 주기를 잡아주고 알림으로 부르면 사용자가 꾸준히 돌아오는가"**
- RingOut 스타일의 스크롤 인터랙션 + 올리브그린 단색 브랜딩

## 브랜드

| 항목 | 값 |
|---|---|
| 서비스명 | 자루 (자취 + 루틴) |
| 한 줄 소개 | 놓치는 자취 살림, 자루가 대신 기억해요 |
| 메인 컬러 | `#667A3E` 올리브그린 |
| 기본 배경 | `#F8F3E8` 웜 크림 |

## 기술 스택

- Vite + React 18 + TypeScript
- 순수 CSS (`src/styles/tokens.css` + `src/styles/styles.css`) — UI 프레임워크 없음
- 애니메이션은 IntersectionObserver + CSS transition/transform 직접 구현 (외부 라이브러리 없음)
- Pretendard (jsDelivr CDN)
- Supabase (이벤트 계측) · Vercel (배포)

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 타입 체크 + 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | 타입만 검사 |

확인해 볼 것:

- `http://localhost:5173/?src=ig` — 유입 파라미터가 이벤트에 붙는지 (콘솔의 `[zaru:event]`)
- 브라우저 개발자도구 → 모바일 뷰(≤768px) — 스티키 해제 / [7] 세로 타임라인
- OS 설정에서 "동작 줄이기"를 켜고 새로고침 — 전환 없이 완성된 상태로 보이는지

## 구조

```
src/
  App.tsx                 섹션 조립 (문서의 [1]~[9] 순서 그대로)
  components/
    Hero.tsx              [1] 히어로 + 패럴랙스
    Empathy.tsx           [2] 공감 (형광 밑줄은 페이지 전체에서 여기 1회만)
    Marquee.tsx           [2.5] 마퀴 띠
    Problems.tsx          [3] 문제 3카드
    About.tsx             [4] 자루 소개
    StickyJourney.tsx     [5] 3축 스티키 저니 ★ (홈 / 살림정보 / 마이)
    Scenario.tsx          [6] 시나리오
    LoopSection.tsx       [7] 다시 루프 (원형 시퀀스) ★
    Preorder.tsx          [8] 사전예약 CTA
    Footer.tsx            [9] 푸터
    mockups/              PhoneFrame + 캡처 목록(mockups.ts)
  hooks/                  reveal / inView / 스크롤 진행률 / 카운트업 / reduced-motion
  lib/analytics.ts        이벤트 전송 · ?src= · 사전예약
  lib/supabase.ts         클라이언트 + 필요한 테이블 DDL 주석
  styles/                 tokens.css(팔레트·모션) + styles.css(전 섹션)
```

## 목업 이미지

앱 화면은 프로토타입 **실제 캡처**입니다.

- 원본(1170×2532)은 `assets-src/mockups/` — 배포에 포함되지 않습니다.
- `public/mockups/` 에는 폭 780px 로 줄인 것만 둡니다 (표시 폭의 약 3배).
- 화면이 바뀌면 원본을 갈아끼운 뒤 다시 줄여 넣으세요.

```bash
sips --resampleWidth 780 assets-src/mockups/01-home.png --out public/mockups/01-home.png
```

`alt` 와 경로는 `src/components/mockups/mockups.ts` 한 곳에 모여 있습니다.
히어로만 `eager`, 나머지는 `lazy` 입니다.

## 문서

- [`docs/CONTENT.md`](docs/CONTENT.md) — 랜딩 내용·문구 전문
- [`docs/DESIGN.md`](docs/DESIGN.md) — 컬러 시스템 + 스크롤 인터랙션 스펙
- [`docs/CONTEXT.md`](docs/CONTEXT.md) — 프로젝트 배경·검증 데이터·의사결정 히스토리

## 계측

이벤트 5종을 Supabase `events` 테이블에 한 건씩 넣습니다.

| 이벤트 | 시점 | 보는 것 |
|---|---|---|
| `view` | 진입 1회 | 모수 |
| `depth` | 스크롤 25/50/75/100% 각 1회 | 어디서 이탈하는지 |
| `step_view` | [5] 스티키 스텝 1~3 도달 각 1회 | 3축 중 무엇이 먹히는지 |
| `notify` | 사전예약 이메일 제출 | **핵심 지표** |
| `kakao_click` | 카카오톡 채널 버튼 클릭 | 보조 전환 |

- `?src=` 를 진입 즉시 localStorage 에 저장해 이후 모든 이벤트에 붙입니다. 없으면 `direct`.
  (ig / form / euta / openchat / woowa / friend)
- 세션 id 는 익명 UUID 입니다.
- **환경변수가 없으면 전송하지 않고 콘솔에만 찍습니다.** 개발 중 에러가 나지 않습니다.

### 설정

1. `.env.local.example` 을 `.env.local` 로 복사하고 값을 채웁니다.
2. Supabase 프로젝트를 **자루용으로 새로** 만듭니다.
   조립소(1차 아이템) 프로젝트를 재사용하면 검증 데이터가 섞입니다.
3. 필요한 테이블 DDL 은 [`src/lib/supabase.ts`](src/lib/supabase.ts) 상단 주석에 있습니다
   (`events`, `preorders` + anon insert 정책).

> ⚠️ 광고를 태우기 전에 반드시 키를 채울 것. 키가 없으면 아무것도 집계되지 않습니다.

## 검증 배경

1차 아이템 "자취 정보 조립소"를 검증한 결과, 광고 냉담 표본의 카드 펼침률이 4%(기준 30%)로 형식 수용이 기각에 가까웠고 재방문이 약했습니다. 문제·타겟은 유지하되 해결 형식을 "정보 조립 → 루틴 관리"로 피벗한 것이 자루입니다. 자세한 히스토리는 [`docs/CONTEXT.md`](docs/CONTEXT.md) 참고.
