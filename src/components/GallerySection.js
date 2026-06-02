import { HiOutlinePhotograph } from "react-icons/hi";
import { GALLERY_ITEMS } from "@/data/siteData";

export default function GallerySection() {
  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title">작업 전후 사진</h2>
        <p className="section-subtitle">
          실제 작업 결과를 확인하세요.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY_ITEMS.map((item, index) => (
            <div key={index} className="group">
              {/* 
                📸 실제 사진으로 교체하는 방법:
                1. public/images/ 폴더에 사진을 넣으세요.
                2. siteData.js에서 해당 항목의 imageSrc를 수정하세요.
                   예: imageSrc: "/images/before.jpg"
              */}
              {item.imageSrc ? (
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={item.imageSrc}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                /* Placeholder (사진 없을 때 표시) */
                <div className="aspect-square rounded-xl bg-gradient-to-br from-[var(--color-primary-light)] to-[#ECFEFF] border border-[var(--color-border)] flex flex-col items-center justify-center gap-2">
                  <HiOutlinePhotograph className="text-4xl text-[var(--color-primary)] opacity-40" />
                  <span className="text-xs text-[var(--color-text-light)]">
                    사진 준비중
                  </span>
                </div>
              )}
              <div className="mt-2 text-center">
                <span className="inline-block text-xs font-semibold bg-[var(--color-primary-light)] text-[var(--color-primary)] px-2 py-0.5 rounded-full mb-1">
                  {item.label}
                </span>
                <p className="text-sm text-[var(--color-text-light)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
