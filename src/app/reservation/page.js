import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationSection from "@/components/ReservationSection";
import MobileBottomBar from "@/components/MobileBottomBar";
import { SITE_INFO } from "@/data/siteData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function ReservationPage() {
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
          if (row.key === "content_reservation") {
            try {
              content = JSON.parse(row.value);
            } catch (e) {}
          } else if (!row.key.startsWith("content_")) {
            siteSettings[row.key] = row.value;
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Header businessName={siteSettings.business_name} />
      <main className="min-h-screen pt-20 pb-16 bg-[var(--color-bg-alt)]">
        <ReservationSection content={content} />
      </main>
      <Footer settings={siteSettings} />
      <MobileBottomBar phone={siteSettings.phone} />
    </>
  );
}
