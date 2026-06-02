import "./globals.css";
import { SITE_INFO } from "@/data/siteData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function generateMetadata() {
  let name = SITE_INFO.name;
  let region = SITE_INFO.region;

  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["business_name", "region"]);

      if (data) {
        data.forEach(row => {
          if (row.key === "business_name" && row.value) name = row.value;
          if (row.key === "region" && row.value) region = row.value;
        });
      }
    } catch (e) {
      console.error("Failed to fetch metadata", e);
    }
  }

  return {
    title: `${name} | ${region} 에어컨 청소 전문`,
    description: `${region} 에어컨 청소 전문 업체. 벽걸이, 스탠드, 시스템 에어컨 분해 세척. 간편 온라인 예약.`,
    keywords: `에어컨 청소, ${region} 에어컨 청소, 에어컨 세척, 벽걸이 에어컨 청소, 시스템 에어컨 청소`,
    openGraph: {
      title: `${name} | ${region} 에어컨 청소 전문`,
      description: `${region} 에어컨 청소 전문 업체. 간편 온라인 예약.`,
      type: "website",
    },
  };
}
export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
