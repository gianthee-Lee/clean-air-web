"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [siteSettings, setSiteSettings] = useState({
    phone: SITE_INFO.phone,
    kakao_url: SITE_INFO.kakaoUrl,
    business_name: SITE_INFO.name,
    region: SITE_INFO.region,
    address: SITE_INFO.address,
    operating_hours: SITE_INFO.operatingHours,
    business_info: SITE_INFO.businessInfo,
  });

  // DB에서 관리한 콘텐츠 데이터
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSiteSettings(data.settings);

          // content_ 로 시작하는 키들을 파싱
          const contentData = {};
          Object.keys(data.settings).forEach((key) => {
            if (key.startsWith("content_")) {
              try {
                contentData[key] = JSON.parse(data.settings[key]);
              } catch (e) {
                // JSON 파싱 실패 시 무시
              }
            }
          });
          setContent(contentData);
        }
      } catch (err) {
        console.log("설정 조회 실패, 기본값 사용");
      }
    };
    fetchSettings();
  }, []);

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
