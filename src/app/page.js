import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import PricingSection from "@/components/PricingSection";
import ProcessSection from "@/components/ProcessSection";
import GallerySection from "@/components/GallerySection";
import ReviewSection from "@/components/ReviewSection";
import ReservationSection from "@/components/ReservationSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import FloatingButtons from "@/components/FloatingButtons";
import TrustBadges from "@/components/TrustBadges";
import { SITE_INFO } from "@/data/siteData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let siteSettings = {
    phone: SITE_INFO.phone,
    kakao_url: SITE_INFO.kakaoUrl,
    business_name: SITE_INFO.name,
    region: SITE_INFO.region,
    address: SITE_INFO.address,
    operating_hours: SITE_INFO.operatingHours,
    business_info: SITE_INFO.businessInfo,
    announcement_text: "🔥 여름 성수기 예약 폭주! 6월 둘째 주 주말 예약 마감 임박",
    announcement_active: "true",
  };

  let content = {};
  let recentReviews = [];

  if (isSupabaseConfigured) {
    try {
      // 설정 가져오기
      const { data, error } = await supabase.from("site_settings").select("*");
      if (!error && data) {
        data.forEach((row) => {
          if (row.key.startsWith("content_")) {
            try {
              content[row.key] = JSON.parse(row.value);
            } catch (e) {
              // ignore
            }
          } else {
            siteSettings[row.key] = row.value;
          }
        });
      }

      // 최근 후기 3개 가져오기
      const { data: reviewsData } = await supabase
        .from("customer_reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (reviewsData) {
        recentReviews = reviewsData;
      }
    } catch (error) {
      console.error("DB Fetch Error:", error);
    }
  }

  return (
    <>
      <Header 
        businessName={siteSettings.business_name} 
        announcementText={siteSettings.announcement_text}
        announcementActive={siteSettings.announcement_active === 'true'}
      />
      <main>
        <HeroSection
          phone={siteSettings.phone}
          kakaoUrl={siteSettings.kakao_url}
          content={content.content_hero}
        />
        <TrustBadges />
        <ServiceSection content={content.content_services} />
        <ProductSection content={content.content_products} />
        <PricingSection content={content.content_pricing} />
        <ProcessSection content={content.content_process} />
        <GallerySection content={content.content_gallery} />
        <ReviewSection content={content.content_reviews} recentReviews={recentReviews} />
        
        {/* 예약하기 안내 섹션 */}
        <section className="section-padding bg-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">지금 바로 예약하세요</h2>
            <p className="text-[var(--color-text-light)] mb-8">
              원하시는 날짜와 시간을 선택하시면 빠르게 확인 후 연락드리겠습니다.
            </p>
            <a href="/reservation" className="btn btn-primary inline-flex items-center gap-2">
              예약 전용 페이지로 이동 ➔
            </a>
          </div>
        </section>

        <FAQSection content={content.content_faq} />
      </main>
      <Footer settings={siteSettings} />
      <MobileBottomBar phone={siteSettings.phone} />
      <FloatingButtons phone={siteSettings.phone} kakaoUrl={siteSettings.kakao_url} />
    </>
  );
}
