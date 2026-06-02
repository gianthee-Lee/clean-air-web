import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";
import MobileBottomBar from "@/components/MobileBottomBar";
import { SITE_INFO } from "@/data/siteData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { HiStar } from "react-icons/hi";

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  let siteSettings = {
    phone: SITE_INFO.phone,
    kakao_url: SITE_INFO.kakaoUrl,
    business_name: SITE_INFO.name,
    region: SITE_INFO.region,
    address: SITE_INFO.address,
    operating_hours: SITE_INFO.operatingHours,
    business_info: SITE_INFO.businessInfo,
  };
  
  let reviews = [];

  if (isSupabaseConfigured) {
    try {
      // 1. 사이트 설정 가져오기
      const { data: settingsData } = await supabase.from("site_settings").select("*");
      if (settingsData) {
        settingsData.forEach((row) => {
          if (!row.key.startsWith("content_")) {
            siteSettings[row.key] = row.value;
          }
        });
      }

      // 2. 고객 후기 가져오기
      const { data: reviewsData } = await supabase
        .from("customer_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (reviewsData) {
        reviews = reviewsData;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <>
      <Header businessName={siteSettings.business_name} />
      <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg-alt)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">고객 후기</h1>
            <p className="text-[var(--color-text-light)]">
              클린에어를 이용해주신 고객님들의 솔직한 후기입니다.
            </p>
          </div>

          <ReviewForm />

          {reviews.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-text-light)]">아직 작성된 후기가 없습니다.<br/>첫 번째 후기를 남겨주세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar
                        key={i}
                        className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[var(--color-text)] leading-relaxed mb-4 text-[0.9375rem] whitespace-pre-wrap">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold">{review.name}</span>
                      <span className="text-[var(--color-text-light)] ml-2">{review.aircon_type}</span>
                    </div>
                    <span className="text-[var(--color-text-light)]">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer settings={siteSettings} />
      <MobileBottomBar phone={siteSettings.phone} />
    </>
  );
}
