/* ============================================================================
   Supabase 클라이언트

   자루 전용 프로젝트를 새로 만들어 연결한다.
   ⚠️ 1차 아이템(조립소) 프로젝트를 재사용하지 말 것 — 검증 데이터가 섞인다.

     VITE_SUPABASE_URL       = https://<project>.supabase.co
     VITE_SUPABASE_ANON_KEY  = anon / publishable key

   환경변수가 없어도 앱은 죽지 않는다. supabase 가 null 이면 전송만 건너뛰고
   analytics 쪽에서 콘솔에 찍는다(개발 중 방어).

   ── 필요한 테이블 ────────────────────────────────────────────────────────

     create table events (
       id         bigint generated always as identity primary key,
       name       text not null,          -- view / depth / notify / kakao_click / step_view
       target     text,                   -- 이벤트 대상 (스텝 번호, 깊이 % 등)
       payload    jsonb,
       src        text,                   -- 유입 경로 (?src=)
       session    text,                   -- 익명 세션 id
       created_at timestamptz default now()
     );

     create table preorders (
       id         bigint generated always as identity primary key,
       email      text not null,
       src        text,
       session    text,
       created_at timestamptz default now()
     );

     -- 익명 삽입만 허용 (읽기는 막아두는 편이 안전하다)
     alter table events   enable row level security;
     alter table preorders enable row level security;
     create policy "anon insert events"   on events    for insert to anon with check (true);
     create policy "anon insert preorders" on preorders for insert to anon with check (true);
   ========================================================================== */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

if (!supabase) {
  console.info(
    "[zaru] Supabase 키가 없어 이벤트를 콘솔에만 남깁니다. .env.local 을 확인하세요."
  );
}
