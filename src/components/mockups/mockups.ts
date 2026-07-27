/* 앱 프로토타입 실제 캡처.
   원본(1170x2532, DPR 3)은 assets-src/mockups/ 에 두고,
   public/ 에는 폭 780px 로 줄인 것만 둔다 (표시 폭의 약 2.5배).

   화면이 바뀌면 assets-src 의 원본을 갈아끼운 뒤 다시 줄여 넣으면 된다.
     sips --resampleWidth 780 assets-src/mockups/01-home.png --out public/mockups/01-home.png */

export interface Mockup {
  src: string;
  alt: string;
}

/** 축소본의 실제 픽셀 크기. width/height 속성으로 넘겨 CLS 를 막는다. */
export const MOCKUP_WIDTH = 780;
export const MOCKUP_HEIGHT = 1688;

export const MOCKUPS = {
  home: {
    src: "/mockups/01-home.png",
    alt: "자루 홈 화면. 위쪽에 적어두기가 접혀 있고, 그 아래로 욕실·세탁 같은 카테고리별 카드가 마지막 완료일과 다음 관리 시점을 보여준다.",
  },
  tips: {
    src: "/mockups/02-tips.png",
    alt: "홈에서 관리 팁을 눌러 바텀시트가 올라온 화면. 해당 카테고리의 조립 카드와 크루 꿀팁이 한 번에 보인다.",
  },
  supplies: {
    src: "/mockups/03-supplies.png",
    alt: "살림정보의 살림템 화면. 청소 용품과 대행 서비스를 카드로 나란히 비교한다.",
  },
  assembly: {
    src: "/mockups/04-assembly.png",
    alt: "살림정보의 조립소 화면. 흩어져 있던 자취 정보를 한 장으로 모아 정리한 카드가 보인다.",
  },
  my: {
    src: "/mockups/05-my.png",
    alt: "마이 화면. 완료한 집안일 기록과 저장해 둔 살림템·꿀팁이 쌓여 있다.",
  },
} as const satisfies Record<string, Mockup>;
