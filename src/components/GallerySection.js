import { HiOutlinePhotograph } from "react-icons/hi";
import { GALLERY_ITEMS } from "@/data/siteData";

export default function GallerySection({ content }) {
  const items = content?.items || GALLERY_ITEMS;
  const sectionTitle = content?.sectionTitle || "작업 전후 비교";

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          꼼꼼한 분해 세척으로 완벽하게 깨끗해진 에어컨을 확인하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
                {item.imageSrc ? (
                  <img
                    src={item.imageSrc}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-4xl mb-2">📸</span>
                    <span className="text-sm">사진 준비중</span>
                  </div>
                )}
                {/* 오버레이 효과 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                  <span className="font-bold text-lg mb-2">{item.label}</span>
                  <p className="text-sm text-gray-200">{item.description}</p>
                </div>
              </div>
              <div className="text-center md:hidden">
                <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                <p className="text-[var(--color-text-light)] text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
