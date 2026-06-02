import { HiStar } from "react-icons/hi";
import { REVIEWS } from "@/data/siteData";

export default function ReviewSection({ content }) {
  const sectionTitle = content?.sectionTitle || '고객 후기';
  const sectionSubtitle = content?.sectionSubtitle || '실제 이용하신 고객님들의 솔직한 후기입니다.';
  const items = content?.items || REVIEWS;
  return (
    <section id="reviews" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          {sectionSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((review, index) => (
            <div key={index} className="card">
              {/* 별점 */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar
                    key={i}
                    className={`text-lg ${
                      i < review.rating
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* 후기 내용 */}
              <p className="text-[var(--color-text)] leading-relaxed mb-4 text-[0.9375rem]">
                &ldquo;{review.text || review.content}&rdquo;
              </p>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-[var(--color-text-light)] ml-2">{review.type}</span>
                </div>
                <span className="text-[var(--color-text-light)]">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
