import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// 예약 목록 조회 (관리자용)
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase가 설정되지 않았습니다." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reservations: data });
}

// 예약 생성 (고객용)
export async function POST(request) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.phone || !body.address || !body.airconType) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    // Supabase가 설정되어 있으면 DB에 저장
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("reservations").insert({
        name: body.name,
        phone: body.phone,
        address: body.address,
        aircon_type: body.airconType,
        quantity: parseInt(body.quantity) || 1,
        preferred_date: body.preferredDate || null,
        preferred_time: body.preferredTime || null,
        memo: body.memo || null,
        is_completed: false,
      });

      if (error) {
        console.error("Supabase 저장 오류:", error);
        return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
      }
    } else {
      // Supabase 미설정 시 콘솔에만 출력
      console.log("📋 새 예약 접수:", JSON.stringify(body, null, 2));
    }

    return NextResponse.json({ success: true, message: "예약이 접수되었습니다." });
  } catch (error) {
    console.error("예약 API 오류:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// 예약 수정 (완료 처리 등)
export async function PATCH(request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, is_completed, admin_memo } = body;

    // 업데이트할 필드만 포함
    const updateData = {};
    if (is_completed !== undefined) updateData.is_completed = is_completed;
    if (admin_memo !== undefined) updateData.admin_memo = admin_memo;

    const { error } = await supabase
      .from("reservations")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
