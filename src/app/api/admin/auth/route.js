import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const password = body.password;

    if (!password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    // DB에서 관리자 비밀번호 조회
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_password");

    if (error) {
      console.error("비밀번호 조회 오류:", error);
      return NextResponse.json({ error: "비밀번호 확인 실패" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "관리자 비밀번호가 설정되지 않았습니다." }, { status: 500 });
    }

    if (data[0].value === password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 });
    }
  } catch (error) {
    console.error("인증 API 오류:", error);
    return NextResponse.json({ error: "서버 오류: " + error.message }, { status: 500 });
  }
}
