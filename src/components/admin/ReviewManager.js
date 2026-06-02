"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { HiStar, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("customer_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("후기 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("정말 이 후기를 삭제하시겠습니까? (삭제 후 복구할 수 없습니다)")) return;

    try {
      const { error } = await supabase
        .from("customer_reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setReviews((prev) => prev.filter((r) => r.id !== id));
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-text-light)]">후기를 불러오는 중...</div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center text-yellow-800">
        <HiOutlineExclamationCircle className="text-4xl mx-auto mb-2 text-yellow-500" />
        <h3 className="font-bold text-lg mb-1">데이터베이스 연결 필요</h3>
        <p className="text-sm opacity-80">고객 후기 기능을 사용하려면 Supabase 설정이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">고객 후기 관리</h2>
          <p className="text-sm text-[var(--color-text-light)] mt-1">
            고객이 남긴 후기를 확인하고 관리할 수 있습니다.
          </p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm font-semibold">
          총 <span className="text-[var(--color-primary)]">{reviews.length}</span>개
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-light)]">
          아직 등록된 고객 후기가 없습니다.
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-start hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">{review.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{review.aircon_type}</span>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-[var(--color-text)] mb-3 whitespace-pre-wrap">{review.content}</p>
                <div className="text-xs text-[var(--color-text-light)]">
                  작성일: {formatDate(review.created_at)}
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(review.id)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 shrink-0"
              >
                <HiOutlineTrash /> 삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
