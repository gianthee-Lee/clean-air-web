import { HiShieldCheck, HiOutlineSparkles, HiOutlineThumbUp, HiOutlineBadgeCheck } from "react-icons/hi";

const BADGES = [
  {
    icon: <HiShieldCheck className="text-3xl text-emerald-500 mb-2" />,
    title: "파손 100% 보상",
    description: "작업 중 발생한 파손 전액 보상"
  },
  {
    icon: <HiOutlineSparkles className="text-3xl text-blue-500 mb-2" />,
    title: "친환경 세제 사용",
    description: "인체에 무해한 안심 전용 세제"
  },
  {
    icon: <HiOutlineBadgeCheck className="text-3xl text-indigo-500 mb-2" />,
    title: "전문 기사 방문",
    description: "수년간의 노하우를 가진 베테랑"
  },
  {
    icon: <HiOutlineThumbUp className="text-3xl text-amber-500 mb-2" />,
    title: "3개월 무상 A/S",
    description: "청소 후 문제 발생 시 즉각 대처"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              {badge.icon}
              <h3 className="font-bold text-[var(--color-text)] text-sm md:text-base mb-1">{badge.title}</h3>
              <p className="text-xs md:text-sm text-[var(--color-text-light)] leading-snug">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
