"use client";

import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiOutlineCheck, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

export default function CalendarView() {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  const formatDate = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayStr); // 기본값을 오늘 날짜로 설정
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("/api/reservation");
        const data = await res.json();
        if (data.reservations) setReservations(data.reservations);
      } catch (err) {
        console.error("예약 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // 완료 토글
  const toggleComplete = async (id, currentStatus) => {
    try {
      await fetch("/api/reservation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_completed: !currentStatus }),
      });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_completed: !currentStatus } : r))
      );
    } catch (err) {
      alert("상태 변경에 실패했습니다.");
    }
  };

  // 달력 계산
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // 날짜별 예약 데이터 매핑
  const getReservationsForDate = (dateStr) => {
    return reservations.filter((r) => r.preferred_date === dateStr);
  };

  // 선택된 날짜의 예약 (시간순 정렬)
  const selectedReservations = selectedDate
    ? getReservationsForDate(selectedDate).sort((a, b) => {
        const timeOrder = { "오전": 0, "오후": 1, "저녁": 2, "협의": 3 };
        const getOrder = (t) => {
          if (!t) return 99;
          for (const key of Object.keys(timeOrder)) {
            if (t.includes(key)) return timeOrder[key];
          }
          return 99;
        };
        return getOrder(a.preferred_time) - getOrder(b.preferred_time);
      })
    : [];

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-text-light)]">달력을 불러오는 중...</div>;
  }

  return (
    <div>
      {/* 달력 */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <HiChevronLeft className="text-xl" />
          </button>
          <h2 className="text-lg font-bold">
            {year}년 {month + 1}월
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <HiChevronRight className="text-xl" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day, i) => (
            <div
              key={day}
              className={`text-center text-xs font-semibold py-2 ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-[var(--color-text-light)]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {/* 빈 칸 (1일 시작 전) */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 sm:h-14" />
          ))}

          {/* 날짜 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDate(year, month, day);
            const dayReservations = getReservationsForDate(dateStr);
            const hasReservations = dayReservations.length > 0;
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === todayStr;
            const dayOfWeek = new Date(year, month, day).getDay();

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-12 sm:h-14 rounded-lg flex flex-col items-center justify-center text-sm relative transition-all ${
                  isSelected
                    ? "bg-[var(--color-primary)] text-white"
                    : isToday
                    ? "bg-[var(--color-primary-light)] font-bold"
                    : "hover:bg-gray-50"
                } ${dayOfWeek === 0 && !isSelected ? "text-red-400" : ""} ${
                  dayOfWeek === 6 && !isSelected ? "text-blue-400" : ""
                }`}
              >
                <span>{day}</span>
                {hasReservations && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? "bg-white" : "bg-[var(--color-primary)]"
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜의 일정 */}
      {selectedDate && (
        <div>
          <h3 className="font-bold text-base mb-3">
            📅 {selectedDate} 일정 ({selectedReservations.length}건)
          </h3>

          {selectedReservations.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-light)] bg-white rounded-xl border border-[var(--color-border)]">
              이 날짜에 예약이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedReservations.map((r) => (
                <div
                  key={r.id}
                  className={`bg-white border rounded-xl p-4 ${
                    r.is_completed ? "border-gray-200 opacity-60" : "border-[var(--color-border)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex-1 ${r.is_completed ? "line-through text-gray-400 decoration-red-400 decoration-2" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {r.preferred_time && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium">
                            {r.preferred_time}
                          </span>
                        )}
                        <span className="font-bold">{r.name}</span>
                      </div>
                      <div className="text-sm space-y-1 text-[var(--color-text-light)]">
                        <div className="flex items-center gap-1">
                          <HiOutlinePhone className="flex-shrink-0" />
                          {r.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineLocationMarker className="flex-shrink-0" />
                          {r.address}
                        </div>
                        <div>🧊 {r.aircon_type} {r.quantity}대</div>
                        {r.memo && <div>💬 고객: {r.memo}</div>}
                        {r.admin_memo && <div className="text-orange-600">📝 메모: {r.admin_memo}</div>}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleComplete(r.id, r.is_completed)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        r.is_completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 text-gray-300 hover:border-green-400 hover:text-green-400"
                      }`}
                    >
                      <HiOutlineCheck className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
