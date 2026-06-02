import { TbAirConditioning, TbBuildingSkyscraper, TbGrid4X4, TbEngine } from "react-icons/tb";
import { HiOutlineClock } from "react-icons/hi";
import { PRODUCTS } from "@/data/siteData";

// 아이콘 매핑
const ICON_MAP = {
  wall: TbAirConditioning,
  stand: TbBuildingSkyscraper,
  system: TbGrid4X4,
  outdoor: TbEngine,
};

export default function ProductSection({ content }) {
  const sectionTitle = content?.sectionTitle || '청소 가능 제품';
  const sectionSubtitle = content?.sectionSubtitle || '다양한 종류의 에어컨 청소가 가능합니다.';
  const items = content?.items ? PRODUCTS.map((p, i) => ({...p, ...(content.items[i] || {})})) : PRODUCTS;
  return (
    <section id="products" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          {sectionSubtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product, index) => {
            const IconComponent = ICON_MAP[product.icon] || TbAirConditioning;
            return (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                  <IconComponent className="text-white text-3xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-[var(--color-text-light)] mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-center gap-1 text-sm text-[var(--color-primary)] font-medium">
                  <HiOutlineClock />
                  <span>{product.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
