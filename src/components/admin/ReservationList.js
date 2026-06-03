"use client";

import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlinePhone, HiOutlineLocationMarker, HiOutlinePencil } from "react-icons/hi";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingMemo, setEditingMemo] = useState(null); // id of reservation being edited
  const [memoText, setMemoText] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservation");
      const data = await res.json();
      if (data.reservations) {
        setReservations(data.reservations);
      }
    } catch (err) {
      console.error("예약 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // 메모 저장
  const saveMemo = async (id) => {
    setSavingMemo(true);
    try {
      await fetch("/api/reservation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, admin_memo: memoText }),
      });
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, admin_memo: memoText } : r))
      );
      setEditingMemo(null);
    } catch (err) {
      alert("메모 저장에 실패했습니다.");
    } finally {
      setSavingMemo(false);
    }
  };

  // 필터링
  const filtered = reservations.filter((r) => {
    if (filter === "pending") return !r.is_completed;
    if (filter === "completed") return r.is_completed;
    return true;
  });

  // 정렬: 미완료 먼저, 그 안에서 희망 방문 날짜(preferred_date) 오름차순(빠른 날짜 먼저), 날짜가 같으면 접수일 기준
  const sorted = [...filtered].sort((a, b) => {
    // 1. 미완료(대기중) 예약이 완료된 예약보다 먼저 오도록
    if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
    
    // 2. 희망 날짜 기준 오름차순 (빠른 날짜가 위로)
    const dateA = a.preferred_date ? new Date(a.preferred_date).getTime() : Infinity;
    const dateB = b.preferred_date ? new Date(b.preferred_date).getTime() : Infinity;
    
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    
    // 3. 희망 날짜가 같거나 둘 다 없으면 먼저 접수된 순서대로
    return new Date(a.created_at) - new Date(b.created_at);
  });

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-text-light)]">예약 목록을 불러오는 중...</div>;
  }

  return (
    <div>
      {/* 상단: 필터 + 카운트 */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-bold">예약 목록 ({reservations.length}건)</h2>
        <div className="flex gap-2">
          {[
            { id: "all", label: "전체" },
            { id: "pending", label: "대기중" },
            { id: "completed", label: "완료" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filter === f.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-[var(--color-border)] text-[var(--color-text-light)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 예약 카드 목록 */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-light)] bg-white rounded-xl border border-[var(--color-border)]">
          {filter === "all" ? "아직 접수된 예약이 없습니다." : "해당하는 예약이 없습니다."}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((r) => (
            <div
              key={r.id}
              className={`bg-white border rounded-xl p-4 transition-all ${
                r.is_completed ? "border-gray-200 opacity-60" : "border-[var(--color-border)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* 예약 정보 */}
                <div className={`flex-1 ${r.is_completed ? "line-through text-gray-400 decoration-red-400 decoration-2" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-base">{r.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.is_completed ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"
                    }`}>
                      {r.is_completed ? "완료" : "대기"}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                      <HiOutlinePhone className="flex-shrink-0" />
                      <span>{r.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                      <HiOutlineLocationMarker className="flex-shrink-0" />
                      <span>{r.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[var(--color-text)]">
                      <span>🧊 {r.aircon_type} {r.quantity}대</span>
                      {r.preferred_date && <span>📅 {r.preferred_date}</span>}
                      {r.preferred_time && <span>🕐 {r.preferred_time}</span>}
                    </div>
                    {r.memo && (
                      <p className="mt-2 text-[var(--color-text-light)] bg-[var(--color-bg-alt)] rounded-lg p-2 text-xs">
                        💬 고객 요청: {r.memo}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    접수: {new Date(r.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>

                {/* 완료 버튼 */}
                <button
                  onClick={() => toggleComplete(r.id, r.is_completed)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all border-2 ${
                    r.is_completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 text-gray-300 hover:border-green-400 hover:text-green-400"
                  }`}
                  title={r.is_completed ? "완료 취소" : "완료 처리"}
                >
                  <HiOutlineCheck className="text-xl" />
                </button>
              </div>

              {/* 관리자 메모 영역 */}
              <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                {editingMemo === r.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={memoText}
                      onChange={(e) => setMemoText(e.target.value)}
                      placeholder="관리자 메모를 입력하세요"
                      className="form-input flex-1 !py-2 text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && saveMemo(r.id)}
                    />
                    <button
                      onClick={() => saveMemo(r.id)}
                      disabled={savingMemo}
                      className="px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                    >
                      {savingMemo ? "..." : "저장"}
                    </button>
                    <button
                      onClick={() => setEditingMemo(null)}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      setEditingMemo(r.id);
                      setMemoText(r.admin_memo || "");
                    }}
                  >
                    <HiOutlinePencil className="text-sm text-gray-400 group-hover:text-[var(--color-primary)]" />
                    {r.admin_memo ? (
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        📝 {r.admin_memo}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 group-hover:text-[var(--color-primary)]">
                        메모 추가...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
