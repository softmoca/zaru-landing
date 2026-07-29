/* ============================================================================
   Supabase 클라이언트

   자취선배 팀 빌딩 랜딩 계측 프로젝트를 연결한다.

     VITE_SUPABASE_URL       = https://<project>.supabase.co
     VITE_SUPABASE_ANON_KEY  = anon / publishable key

   환경변수가 없어도 앱은 죽지 않는다. supabase 가 null 이면 전송만 건너뛰고
   analytics 쪽에서 콘솔에 찍는다(개발 중 방어).

   ── 필요한 테이블 ────────────────────────────────────────────────────────

     create table events (
       id         bigint generated always as identity primary key,
       name       text not null,          -- view / depth / step_view / team_cta_click
       target     text,                   -- 이벤트 대상 (스텝 번호, 깊이 % 등)
       payload    jsonb,
       src        text,                   -- 유입 경로 (?src=)
       session    text,                   -- 익명 세션 id
       created_at timestamptz default now()
     );

     -- 익명 삽입만 허용 (읽기는 막아두는 편이 안전하다)
     alter table events enable row level security;
     create policy "anon insert events" on events for insert to anon with check (true);
   ========================================================================== */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

if (!supabase) {
  console.info(
    "[jachwiseonbae] Supabase 키가 없어 이벤트를 콘솔에만 남깁니다. .env.local 을 확인하세요."
  );
}
