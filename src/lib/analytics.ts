/* ============================================================================
   계측 계층

   이벤트는 Supabase events 테이블로 한 건씩 insert 한다.
   (localStorage 집계는 브라우저마다 갈려서 판정에 못 쓴다 — 1차 프로젝트의 교훈)

   - 세션 id: 익명 랜덤 UUID. 같은 방문자의 이벤트를 묶기 위한 값(개인정보 아님)
   - 유입 경로: ?src= 를 최초 진입 시 저장해 세션 내내 모든 이벤트에 붙인다.
     없으면 'direct'.
   - 키가 없으면 콘솔에만 찍고 조용히 넘어간다 (개발 중 에러 방지)
   ========================================================================== */

import { supabase } from "./supabase";

export type EventName =
  | "view" //         페이지 진입
  | "depth" //        스크롤 깊이 도달 (25/50/75/100)
  | "step_view" //     [5] 세 가지 순간 스텝 도달
  | "prototype_start"
  | "prototype_step"
  | "profile_completed"
  | "listing_completed"
  | "result_viewed"
  | "question_copied"
  | "research_record_copied"
  | "decision_saved"
  | "official_source_clicked"
  | "second_listing_started";

const SESSION_KEY = "zaru:session";
const SRC_KEY = "zaru:src";

/** ?src= 로 들어올 수 있는 유입 채널. 문서화 목적이라 값 검증에는 쓰지 않는다. */
export const KNOWN_SOURCES = [
  "ig", // 메타 광고
  "form", // 구글폼 응답자
  "euta", // 이타서포터즈
  "openchat", // 오픈채팅
  "woowa", // 우테코
  "friend", // 지인
] as const;

/* ── 세션 / 유입 경로 ─────────────────────────────────────────────────────── */

function safeLocalStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    // 사파리 프라이빗 모드 등에서 접근 자체가 막히는 경우
    return null;
  }
}

export function sessionId(): string {
  const store = safeLocalStorage();
  if (!store) return "no-storage";

  let id = store.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    store.setItem(SESSION_KEY, id);
  }
  return id;
}

/** URL 의 ?src= 를 세션에 저장한다. 있으면 갱신, 없으면 기존값 유지.
 *  진입 시 한 번 호출해두면 이후 모든 이벤트에 자동으로 붙는다. */
export function captureSrc(): string {
  if (typeof window === "undefined") return "direct";

  const fromUrl = new URLSearchParams(window.location.search).get("src");
  const store = safeLocalStorage();

  if (fromUrl) {
    store?.setItem(SRC_KEY, fromUrl);
    return fromUrl;
  }
  return store?.getItem(SRC_KEY) ?? "direct";
}

/** 저장된 유입 경로. 없으면 'direct'. */
export function currentSrc(): string {
  if (typeof window === "undefined") return "direct";
  return safeLocalStorage()?.getItem(SRC_KEY) ?? "direct";
}

/* ── 이벤트 전송 ──────────────────────────────────────────────────────────── */

interface TrackOptions {
  /** 이벤트 대상 (스텝 번호, 스크롤 깊이 등) */
  target?: string | number | null;
  payload?: Record<string, unknown> | null;
}

/** 이벤트 한 건 기록. 실패해도 화면은 절대 안 죽는다. */
export async function track(
  name: EventName,
  { target = null, payload = null }: TrackOptions = {}
): Promise<void> {
  const row = {
    name,
    target: target === null ? null : String(target),
    payload,
    src: currentSrc(),
    session: sessionId(),
  };

  if (!supabase) {
    console.debug("[zaru:event]", row);
    return;
  }

  try {
    const { error } = await supabase.from("events").insert(row);
    if (error) console.warn("[zaru] 이벤트 전송 실패", error.message, row);
  } catch (e) {
    console.warn("[zaru] 이벤트 전송 예외", e);
  }
}

/** 같은 키로는 세션(페이지 로드) 당 한 번만 보낸다. depth / step_view 중복 방지용. */
const fired = new Set<string>();

export function trackOnce(
  key: string,
  name: EventName,
  options?: TrackOptions
): void {
  if (fired.has(key)) return;
  fired.add(key);
  void track(name, options);
}
