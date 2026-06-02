"use client";

import { useState } from "react";
import { HiStar } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function ReviewForm({ onReviewAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    aircon_type: "벽걸이",
    rating: 5,
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      alert("이름과 후기 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert("후기가 등록되었습니다! 소중한 의견 감사합니다.");
        setFormData({ name: "", aircon_type: "벽걸이", rating: 5, content: "" });
        setIsOpen(false);
        if (onReviewAdded) onReviewAdded();
        router.refresh();
      } else {
        alert("후기 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (err) {
      alert("오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="text-center mb-10">
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
        >
          직접 후기 남기기 ✎
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 mb-10 max-w-2xl mx-auto shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">후기 작성</h3>
        <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-light)] text-sm">
          취소
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label block mb-1">작성자 이름</label>
            <input 
              type="text" 
              className="form-input w-full" 
              placeholder="예: 홍길동"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label block mb-1">에어컨 종류</label>
            <select 
              className="form-input w-full"
              value={formData.aircon_type}
              onChange={e => setFormData({...formData, aircon_type: e.target.value})}
            >
              <option value="벽걸이">벽걸이</option>
              <option value="스탠드">스탠드</option>
              <option value="시스템 1way">시스템 1way</option>
              <option value="시스템 4way">시스템 4way</option>
              <option value="실외기">실외기</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label block mb-1">별점</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(star => (
              <HiStar 
                key={star} 
                className={`text-3xl cursor-pointer transition-colors ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                onClick={() => setFormData({...formData, rating: star})}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="form-label block mb-1">후기 내용</label>
          <textarea 
            className="form-input w-full"
            rows="4"
            placeholder="청소 서비스는 어떠셨나요? 다른 고객님들을 위해 솔직한 후기를 남겨주세요."
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? "등록 중..." : "후기 등록하기"}
        </button>
      </form>
    </div>
  );
}
