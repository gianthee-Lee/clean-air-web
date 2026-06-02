"use client";

import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineCalendar } from "react-icons/hi";
import { SITE_INFO } from "@/data/siteData";

export default function MobileBottomBar({ phone = SITE_INFO.phone }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-border)] shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex">
        <a
          href={`tel:${phone.replace(/-/g, "")}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-[var(--color-success)] font-semibold text-[0.9375rem] border-r border-[var(--color-border)]"
        >
          <FiPhoneCall className="text-lg" />
          전화 문의
        </a>
        <a
          href="#reservation"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--color-primary)] text-white font-semibold text-[0.9375rem]"
        >
          <HiOutlineCalendar className="text-lg" />
          예약하기
        </a>
      </div>
    </div>
  );
}
