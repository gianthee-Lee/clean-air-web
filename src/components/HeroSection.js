import { FiPhoneCall } from "react-icons/fi";
import { RiKakaoTalkFill } from "react-icons/ri";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { HERO_DATA, SITE_INFO } from "@/data/siteData";

export default function HeroSection({ phone = SITE_INFO.phone, kakaoUrl = "", content }) {
  // DB 콘텐츠가 있으면 우선 사용, 없으면 siteData 기본값
  const h = { ...HERO_DATA, ...content };
  return (
    <section
      id="hero"
      className="relative pt-24 pb-16 px-4 md:pt-32 md:pb-24"
      style={{
        background: "linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 50%, #ECFEFF 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* 뱃지 */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-full px-4 py-2 mb-6">
          <HiOutlineShieldCheck className="text-[var(--color-primary)] text-lg" />
          <span className="text-sm font-medium text-[var(--color-text-light)]">
            {h.trustBadge}
          </span>
        </div>

        {/* 메인 제목 */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] mb-4 leading-tight">
          {h.title}
        </h1>

        <p className="text-lg md:text-xl text-[var(--color-text)] font-medium mb-2">
          {h.subtitle}
        </p>
        <p className="text-base text-[var(--color-text-light)] mb-8 max-w-md mx-auto">
          {h.description}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#reservation" className="btn btn-primary w-full sm:w-auto text-lg py-4">
            {h.ctaText}
          </a>
          <a
            href={`tel:${phone.replace(/-/g, "")}`}
            className="btn btn-phone w-full sm:w-auto"
          >
            <FiPhoneCall />
            {h.phoneText}
          </a>
          <a
            href={kakaoUrl || "#"}
            target={kakaoUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn btn-kakao w-full sm:w-auto"
          >
            <RiKakaoTalkFill size={20} />
            {h.kakaoText}
          </a>
        </div>
      </div>

      {/* 하단 웨이브 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1440 20 1140 0 720 0C300 0 0 20 0 20L0 60Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
