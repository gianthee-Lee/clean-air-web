import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SITE_INFO } from "@/data/siteData";

export const dynamic = 'force-dynamic';

// 설정 조회
export async function GET() {
  // Supabase가 설정되어 있으면 DB에서 조회
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("site_settings").select("*");

    if (!error && data) {
      const settings = {};
      data.forEach((row) => {
        settings[row.key] = row.value;
      });
      return NextResponse.json({ settings, source: "database" });
    }
  }

  // Supabase 미설정 또는 오류 시 siteData.js 기본값 반환
  return NextResponse.json({
    settings: {
      phone: SITE_INFO.phone,
      kakao_url: SITE_INFO.kakaoUrl,
      business_name: SITE_INFO.name,
      region: SITE_INFO.region,
      address: SITE_INFO.address,
      operating_hours: SITE_INFO.operatingHours,
      business_info: SITE_INFO.businessInfo,
    },
    source: "default",
  });
}

// 설정 수정 (관리자용)
export async function POST(request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    const { error } = await supabase
      .from("site_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
