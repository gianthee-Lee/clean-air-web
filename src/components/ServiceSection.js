import { TbDropletOff, TbBug, TbWind, TbBolt, TbChecklist } from "react-icons/tb";
import { SERVICES } from "@/data/siteData";

// 아이콘 매핑 (siteData.js의 icon 값에 대응)
const ICON_MAP = {
  smell: TbDropletOff,
  mold: TbBug,
  dust: TbWind,
  efficiency: TbBolt,
  checkup: TbChecklist,
};

export default function ServiceSection({ content }) {
  const sectionTitle = content?.sectionTitle || "에어컨 청소, 왜 필요할까요?";
  const sectionDesc = content?.sectionDescription || "오래된 에어컨 내부에는 눈에 보이지 않는 곰팡이와 세균이 번식합니다. 정기적인 청소로 건강한 실내 환경을 만드세요.";
  // DB 항목이 있으면 siteData의 아이콘과 합쳐서 사용
  const items = content?.items ? SERVICES.map((s, i) => ({ ...s, ...(content.items[i] || {}) })) : SERVICES;

  return (
    <section id="services" className="section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">{sectionDesc}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((service, index) => {
            const IconComponent = ICON_MAP[service.icon] || TbWind;
            return (
              <div key={index} className="card text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
                  <IconComponent className="text-[var(--color-primary)] text-2xl" />
                </div>
                <h3 className="font-semibold text-base mb-1">{service.title}</h3>
                <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
