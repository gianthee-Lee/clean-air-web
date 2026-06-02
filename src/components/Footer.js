import { FiPhoneCall } from "react-icons/fi";
import { SITE_INFO } from "@/data/siteData";

export default function Footer({ settings = {} }) {
  const phone = settings.phone || SITE_INFO.phone;
  const businessName = settings.business_name || SITE_INFO.name;
  const region = settings.region || SITE_INFO.region;
  const address = settings.address || SITE_INFO.address;
  const operatingHours = settings.operating_hours || SITE_INFO.operatingHours;
  const businessInfo = settings.business_info || SITE_INFO.businessInfo;

  return (
    <footer className="bg-[#1E293B] text-white/80">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">❄️</span>
              <span className="text-lg font-bold text-white">{businessName}</span>
            </div>
            <p className="text-sm leading-relaxed">
              {region} 에어컨 청소 전문 업체
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FiPhoneCall className="text-[var(--color-primary)]" />
              <a
                href={`tel:${phone.replace(/-/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {phone}
              </a>
            </div>
            <p>운영지역: {region}</p>
            <p>주소: {address}</p>
            <p>운영시간: {operatingHours}</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-3 text-xs text-white/50">
            <p>{businessInfo}</p>
            <p>
              개인정보처리방침 | 수집항목: 이름, 연락처, 주소 | 이용목적: 예약 접수 및 상담
            </p>
          </div>
          <p className="text-xs text-white/30 mt-3">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
