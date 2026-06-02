"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineClipboardList, HiOutlineCalendar, HiOutlineCog, HiOutlineLogout, HiOutlinePencilAlt } from "react-icons/hi";
import ReservationList from "@/components/admin/ReservationList";
import CalendarView from "@/components/admin/CalendarView";
import SettingsPanel from "@/components/admin/SettingsPanel";
import ContentEditor from "@/components/admin/ContentEditor";
import ReviewManager from "@/components/admin/ReviewManager";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const TABS = [
  { id: "reservations", label: "예약 관리", icon: HiOutlineClipboardList },
  { id: "calendar", label: "달력", icon: HiOutlineCalendar },
  { id: "reviews", label: "후기 관리", icon: HiOutlineChatAlt2 },
  { id: "content", label: "콘텐츠 관리", icon: HiOutlinePencilAlt },
  { id: "settings", label: "설정", icon: HiOutlineCog },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();

  // 로그인 확인
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_pw");
    router.push("/admin");
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-alt)] flex items-center justify-center">
        <p className="text-[var(--color-text-light)]">로그인 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-alt)]">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">❄️</span>
            <span className="font-bold text-[var(--color-primary-dark)]">관리자</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)]">
              사이트 보기 ↗
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <HiOutlineLogout />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                }`}
              >
                <Icon className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "reservations" && <ReservationList />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "reviews" && <ReviewManager />}
        {activeTab === "content" && <ContentEditor />}
        {activeTab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}
