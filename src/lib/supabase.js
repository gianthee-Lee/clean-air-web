import { createClient } from "@supabase/supabase-js";

/**
 * ============================================================
 * 📌 Supabase 연결 설정
 * ============================================================
 *
 * .env.local 파일에 아래 두 값을 넣어야 합니다:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
 *
 * 값이 없으면 Supabase 기능이 비활성화되고,
 * 사이트는 siteData.js의 기본값으로 동작합니다.
 * ============================================================
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabase가 설정되어 있는지 확인
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

// Supabase 클라이언트 (설정 안 되어 있으면 null)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
