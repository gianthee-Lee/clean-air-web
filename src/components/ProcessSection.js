import { HiOutlineClipboardList, HiOutlineCalendar, HiOutlineEye, HiOutlineCog, HiOutlineCheckCircle } from "react-icons/hi";
import { PROCESS_STEPS } from "@/data/siteData";

// 단계별 아이콘 매핑
const STEP_ICONS = [
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineCog,
  HiOutlineCheckCircle,
];

export default function ProcessSection({ content }) {
  const sectionTitle = content?.sectionTitle || '작업 과정';
  const sectionSubtitle = content?.sectionSubtitle || '체계적인 5단계 청소 프로세스로 진행합니다.';
  const steps = content?.steps || PROCESS_STEPS;
  return (
    <section id="process" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          {sectionSubtitle}
        </p>

        {/* 모바일: 세로 타임라인 / 데스크톱: 가로 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-4">
          {steps.map((step, index) => {
            const IconComponent = STEP_ICONS[index] || HiOutlineCheckCircle;
            return (
              <div key={index} className="flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-3 relative flex-1">
                {/* 연결선 (모바일) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-[calc(100%+0.5rem)] bg-[var(--color-border)] md:hidden" />
                )}
                
                {/* 번호 아이콘 */}
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 relative z-10">
                  <IconComponent className="text-white text-xl" />
                </div>

                <div className="md:mt-1">
                  <div className="text-xs font-bold text-[var(--color-primary)] mb-0.5">
                    STEP {step.step}
                  </div>
                  <h3 className="font-semibold text-base mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* 연결선 (데스크톱) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-[var(--color-border)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
