import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase가 설정되지 않았습니다." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, rating, content, aircon_type } = body;

    if (!name || !rating || !content) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("customer_reviews")
      .insert([{ name, rating, content, aircon_type }])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("후기 저장 실패:", error);
    return NextResponse.json({ error: "후기 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase 설정 안됨", reviews: [] });
  }

  try {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ reviews: data });
  } catch (error) {
    return NextResponse.json({ error: "조회 실패", reviews: [] });
  }
}
