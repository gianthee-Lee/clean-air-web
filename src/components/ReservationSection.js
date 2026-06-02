"use client";

import { useState } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { AIRCON_TYPES, TIME_SLOTS } from "@/data/siteData";

export default function ReservationSection({ content }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    airconType: "",
    quantity: "1",
    preferredDate: "",
    preferredTime: "",
    memo: "",
    privacyAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!formData.name || !formData.phone || !formData.address || !formData.airconType) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!formData.privacyAgreed) {
      alert("개인정보 수집에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * ============================================================
       * 📌 예약 데이터 저장 연동 방법
       * ============================================================
       * 
       * 현재는 /api/reservation 로컬 API로 동작합니다.
       * 실제 운영 시 아래 방법 중 하나로 연동하세요:
       * 
       * 🔹 방법 1: Google Sheets 연동 (추천, 무료)
       *    1. Google Drive에서 새 스프레드시트를 만듭니다.
       *    2. 확장 프로그램 > Apps Script를 클릭합니다.
       *    3. README.md의 "Google Sheets 연동" 섹션을 참고하세요.
       *    4. 아래 URL을 Apps Script 웹 앱 URL로 교체하세요:
       * 
       *    const response = await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
       *      method: "POST",
       *      body: JSON.stringify(formData),
       *    });
       * 
       * 🔹 방법 2: Supabase 연동 (무료 플랜)
       *    README.md의 "Supabase 연동" 섹션을 참고하세요.
       * ============================================================
       */
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("예약 접수 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("예약 제출 오류:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <section id="reservation" className="section-padding bg-white">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <HiOutlineCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold mb-3">예약 신청이 접수되었습니다</h2>
          <p className="text-[var(--color-text-light)] mb-6 leading-relaxed">
            확인 후 빠른 시간 내에 연락드리겠습니다.<br />
            감사합니다.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                phone: "",
                address: "",
                airconType: "",
                quantity: "1",
                preferredDate: "",
                preferredTime: "",
                memo: "",
                privacyAgreed: false,
              });
            }}
            className="btn btn-primary"
          >
            새 예약 신청하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="reservation" className="section-padding bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="section-title">{content?.sectionTitle || '예약 신청'}</h2>
        <p className="section-subtitle">
          {content?.sectionDescription || '아래 양식을 작성하시면 빠르게 확인 후 연락드리겠습니다.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="form-label">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              className="form-input"
              required
            />
          </div>

          {/* 연락처 */}
          <div>
            <label htmlFor="phone" className="form-label">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="form-input"
              required
            />
          </div>

          {/* 지역/주소 */}
          <div>
            <label htmlFor="address" className="form-label">
              지역 / 주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="포항시 남구 오천읍 ○○아파트 ○○동 ○○호"
              className="form-input"
              required
            />
          </div>

          {/* 에어컨 종류 + 수량 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="airconType" className="form-label">
                에어컨 종류 <span className="text-red-500">*</span>
              </label>
              <select
                id="airconType"
                name="airconType"
                value={formData.airconType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">선택하세요</option>
                {AIRCON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className="form-label">
                수량
              </label>
              <select
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="form-input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}대
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 희망 날짜 */}
          <div>
            <label htmlFor="preferredDate" className="form-label">
              희망 날짜
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* 희망 시간대 */}
          <div>
            <label className="form-label">희망 시간대</label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                    formData.preferredTime === slot
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredTime"
                    value={slot}
                    checked={formData.preferredTime === slot}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          {/* 요청사항 */}
          <div>
            <label htmlFor="memo" className="form-label">
              요청사항
            </label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="특이사항이나 요청사항을 입력해주세요."
              rows={3}
              className="form-input resize-none"
            />
          </div>

          {/* 개인정보 동의 */}
          <div className="bg-[var(--color-bg-alt)] rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="privacyAgreed"
                checked={formData.privacyAgreed}
                onChange={handleChange}
                className="mt-0.5 w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text-light)] leading-relaxed">
                <span className="font-medium text-[var(--color-text)]">개인정보 수집 및 이용에 동의합니다.</span>
                <br />
                수집항목: 이름, 연락처, 주소 | 이용목적: 예약 접수 및 상담 | 보유기간: 서비스 완료 후 1년
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "접수 중..." : "예약 신청하기"}
          </button>
        </form>
      </div>
    </section>
  );
}
