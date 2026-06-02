import { HiOutlineInformationCircle } from "react-icons/hi";
import { PRICING, PRICING_NOTES } from "@/data/siteData";

export default function PricingSection({ content }) {
  const sectionTitle = content?.sectionTitle || '서비스 가격';
  const sectionSubtitle = content?.sectionSubtitle || '투명한 가격으로 안심하고 이용하세요.';
  const items = content?.items || PRICING;
  const notes = content?.notes || PRICING_NOTES;
  const ctaText = content?.ctaText || '지금 예약 신청하기';
  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          {sectionSubtitle}
        </p>

        {/* 가격 카드 목록 */}
        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors"
            >
              <div>
                <h3 className="font-semibold text-base">{item.type || item.name}</h3>
                {(item.description || item.note) && (
                  <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                    {item.description || item.note}
                  </p>
                )}
              </div>
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {item.price}
              </span>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <div className="bg-[var(--color-bg-alt)] rounded-xl p-4 space-y-2">
          {notes.map((note, index) => (
            <div key={index} className="flex items-start gap-2">
              <HiOutlineInformationCircle className="text-[var(--color-text-light)] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[var(--color-text-light)]">{note}</p>
            </div>
          ))}
        </div>

        {/* 예약 유도 버튼 */}
        <div className="text-center mt-8">
          <a href="#reservation" className="btn btn-primary">
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
