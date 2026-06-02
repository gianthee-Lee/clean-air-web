import "./globals.css";
import { SITE_INFO } from "@/data/siteData";

export const metadata = {
  title: `${SITE_INFO.name} | ${SITE_INFO.region} 에어컨 청소 전문`,
  description: `${SITE_INFO.region} 에어컨 청소 전문 업체. 벽걸이, 스탠드, 시스템 에어컨 분해 세척. 간편 온라인 예약.`,
  keywords: "에어컨 청소, 포항 에어컨 청소, 에어컨 세척, 벽걸이 에어컨 청소, 시스템 에어컨 청소",
  openGraph: {
    title: `${SITE_INFO.name} | ${SITE_INFO.region} 에어컨 청소 전문`,
    description: `${SITE_INFO.region} 에어컨 청소 전문 업체. 간편 온라인 예약.`,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
