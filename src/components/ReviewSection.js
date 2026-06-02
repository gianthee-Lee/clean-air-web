import { HiStar } from "react-icons/hi";
import { REVIEWS } from "@/data/siteData";

export default function ReviewSection({ content, recentReviews }) {
  const sectionTitle = content?.sectionTitle || '고객 후기';
  const sectionSubtitle = content?.sectionSubtitle || '실제 이용하신 고객님들의 솔직한 후기입니다.';
  
  // DB에서 가져온 최근 후기가 있으면 사용, 없으면 설정값/기본값 사용
  const items = recentReviews && recentReviews.length > 0 
    ? recentReviews 
    : (content?.items || REVIEWS);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    // 만약 "2025.04" 같은 기존 포맷이면 그대로 반환
    if (!dateString || String(dateString).length < 10) return dateString;
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <section id="reviews" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          {sectionSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <p className="text-[var(--color-text)] leading-relaxed mb-4 text-[0.9375rem] line-clamp-3">
                &ldquo;{review.text || review.content}&rdquo;
              </p>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-[var(--color-text-light)] ml-2">{review.type || review.aircon_type}</span>
                </div>
                <span className="text-[var(--color-text-light)]">{formatDate(review.date || review.created_at)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 후기 전체 보기 및 작성 버튼 */}
        <div className="text-center">
          <a href="/reviews" className="btn btn-outline inline-flex items-center gap-2">
            후기 전체 보기 및 작성하기 ➔
          </a>
        </div>
      </div>
    </section>
  );
}
