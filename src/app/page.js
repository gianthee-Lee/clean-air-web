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
  };

  let content = {};

  if (isSupabaseConfigured) {
    try {
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
    } catch (error) {
      console.error("DB Fetch Error:", error);
    }
  }

  return (
    <>
      <Header businessName={siteSettings.business_name} />
      <main>
        <HeroSection
          phone={siteSettings.phone}
          kakaoUrl={siteSettings.kakao_url}
          content={content.content_hero}
        />
        <ServiceSection content={content.content_services} />
        <ProductSection content={content.content_products} />
        <PricingSection content={content.content_pricing} />
        <ProcessSection content={content.content_process} />
        <GallerySection />
        <ReviewSection content={content.content_reviews} />
        <ReservationSection content={content.content_reservation} />
        <FAQSection content={content.content_faq} />
      </main>
      <Footer settings={siteSettings} />
      <MobileBottomBar phone={siteSettings.phone} />
    </>
  );
}
