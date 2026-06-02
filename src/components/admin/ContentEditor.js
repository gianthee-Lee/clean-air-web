"use client";

import { useState, useEffect } from "react";
import { 
  HERO_DATA, 
  SERVICES, 
  PRODUCTS, 
  PRICING, 
  PRICING_NOTES, 
  PROCESS_STEPS, 
  REVIEWS, 
  FAQ_DATA,
  GALLERY_ITEMS
} from "@/data/siteData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import ImageUpload from "./ImageUpload";

// ─── 기본값 ───────────────────────────────────────────────
const DEFAULT_HERO = {
  title: HERO_DATA.title,
  subtitle: HERO_DATA.subtitle,
  description: HERO_DATA.description,
  trustBadge: HERO_DATA.trustBadge,
  ctaText: HERO_DATA.ctaText,
  phoneText: HERO_DATA.phoneText,
  kakaoText: HERO_DATA.kakaoText,
};

const DEFAULT_SERVICES = {
  sectionTitle: "에어컨 청소, 왜 필요할까요?",
  sectionDescription: "",
  items: SERVICES.map(s => ({ title: s.title, description: s.description })),
};

const DEFAULT_PRODUCTS = {
  sectionTitle: "청소 가능 제품",
  items: PRODUCTS.map(p => ({ name: p.name, description: p.description, time: p.duration })),
};

const DEFAULT_PRICING = {
  sectionTitle: "투명한 가격 안내",
  items: PRICING.map(p => ({ type: p.name, price: p.price, description: p.note })),
  notes: [...PRICING_NOTES],
  ctaText: "예약하기",
};

const DEFAULT_PROCESS = {
  sectionTitle: "청소 진행 과정",
  steps: PROCESS_STEPS.map(p => ({ step: String(p.step), title: p.title, description: p.description })),
};

const DEFAULT_REVIEWS = {
  sectionTitle: "고객 후기",
  items: REVIEWS.map(r => ({ name: r.name, rating: String(r.rating), text: r.content, date: r.date, type: r.type })),
};

const DEFAULT_FAQ = {
  sectionTitle: "자주 묻는 질문",
  items: FAQ_DATA.map(f => ({ question: f.question, answer: f.answer })),
};

const DEFAULT_RESERVATION = {
  sectionTitle: "예약 신청",
  sectionDescription: "아래 정보를 입력하시면 빠르게 연락드리겠습니다.",
};

const DEFAULT_GALLERY = {
  sectionTitle: "작업 전후 갤러리",
  items: GALLERY_ITEMS.map(g => ({ label: g.label, description: g.description, imageSrc: g.imageSrc || "" })),
};

// ─── 유틸 ─────────────────────────────────────────────────
function safeParse(jsonString, fallback) {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

// ─── 섹션 래퍼 ────────────────────────────────────────────
function CollapsibleSection({ title, badge, expanded, onToggle, children }) {
  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 16px",
          background: "var(--color-bg-alt)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--color-text)",
        }}
      >
        <span style={{ fontSize: "12px", width: "16px", flexShrink: 0 }}>
          {expanded ? "▼" : "▶"}
        </span>
        <span style={{ flex: 1 }}>{title}</span>
        {badge !== undefined && badge !== null && (
          <span
            style={{
              fontSize: "12px",
              color: "var(--color-text-light)",
              fontWeight: 500,
            }}
          >
            {badge}
          </span>
        )}
      </button>
      {expanded && <div style={{ padding: "16px" }}>{children}</div>}
    </div>
  );
}

// ─── 저장 버튼 ────────────────────────────────────────────
function SaveButton({ saving, saved, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
      <button
        type="button"
        className="btn btn-primary"
        disabled={saving}
        onClick={onClick}
        style={{ minWidth: "80px" }}
      >
        {saving ? "저장 중..." : "저장"}
      </button>
      {saved && (
        <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "14px" }}>✓ 저장됨!</span>
      )}
    </div>
  );
}

// ─── 텍스트 필드 ──────────────────────────────────────────
function TextField({ label, value, onChange, placeholder, multiline }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label className="form-label" style={{ display: "block", marginBottom: "4px" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          className="form-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ width: "100%", resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          className="form-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}

// ─── 배열 항목 카드 ───────────────────────────────────────
function ItemCard({ index, children, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
        position: "relative",
        background: "var(--color-bg-alt)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "13px",
            color: "var(--color-primary)",
          }}
        >
          #{index + 1}
        </span>
        <button
          type="button"
          onClick={onDelete}
          style={{
            background: "none",
            border: "none",
            color: "#dc2626",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          삭제
        </button>
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  메인 컴포넌트
// ═══════════════════════════════════════════════════════════
export default function ContentEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 섹션 상태
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [process, setProcess] = useState(DEFAULT_PROCESS);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [faq, setFaq] = useState(DEFAULT_FAQ);
  const [reservation, setReservation] = useState(DEFAULT_RESERVATION);
  const [gallery, setGallery] = useState(DEFAULT_GALLERY);

  // 열림/닫힘
  const [expanded, setExpanded] = useState({});

  // 저장 상태
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  // ─── 데이터 로드 ──────────────────────────────────────
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("설정을 불러오지 못했습니다.");
        const data = await res.json();
        const s = data.settings || {};

        setHero(safeParse(s.content_hero, DEFAULT_HERO));
        setServices(safeParse(s.content_services, DEFAULT_SERVICES));
        setProducts(safeParse(s.content_products, DEFAULT_PRODUCTS));
        setPricing(safeParse(s.content_pricing, DEFAULT_PRICING));
        setProcess(safeParse(s.content_process, DEFAULT_PROCESS));
        setReviews(safeParse(s.content_reviews, DEFAULT_REVIEWS));
        setFaq(safeParse(s.content_faq, DEFAULT_FAQ));
        setReservation(safeParse(s.content_reservation, DEFAULT_RESERVATION));
        setGallery(safeParse(s.content_gallery, DEFAULT_GALLERY));
      } catch (err) {
        console.error("콘텐츠 로드 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // ─── 저장 핸들러 ──────────────────────────────────────
  const saveSection = async (key, value) => {
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: JSON.stringify(value) }),
      });
      if (!res.ok) throw new Error();
      setSaved((p) => ({ ...p, [key]: true }));
      setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2000);
    } catch {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  // ─── 배열 헬퍼 ────────────────────────────────────────
  const updateArrayItem = (setter, arrayKey, index, field, value) => {
    setter((prev) => {
      const arr = [...(prev[arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayKey]: arr };
    });
  };

  const addArrayItem = (setter, arrayKey, template) => {
    setter((prev) => ({
      ...prev,
      [arrayKey]: [...(prev[arrayKey] || []), { ...template }],
    }));
  };

  const removeArrayItem = (setter, arrayKey, index) => {
    setter((prev) => ({
      ...prev,
      [arrayKey]: (prev[arrayKey] || []).filter((_, i) => i !== index),
    }));
  };

  // ─── 로딩 / 에러 ─────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-12 text-[var(--color-text-light)]">
        콘텐츠를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#dc2626" }}>
        <p style={{ fontWeight: 600 }}>오류가 발생했습니다</p>
        <p style={{ fontSize: "14px", marginTop: "4px" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <p
        style={{
          fontSize: "13px",
          color: "var(--color-text-light)",
          marginBottom: "16px",
        }}
      >
        고객 페이지에 표시되는 모든 텍스트를 수정할 수 있습니다. 섹션을 클릭해서 펼친 뒤
        내용을 편집하고 저장 버튼을 눌러주세요.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* ─── 1. 히어로 ──────────────────────────────── */}
        <CollapsibleSection
          title="히어로"
          expanded={expanded.hero}
          onToggle={() => toggle("hero")}
        >
          <TextField
            label="메인 제목"
            value={hero.title}
            onChange={(v) => setHero((p) => ({ ...p, title: v }))}
            placeholder="포항 에어컨 청소 예약"
          />
          <TextField
            label="서브 타이틀"
            value={hero.subtitle}
            onChange={(v) => setHero((p) => ({ ...p, subtitle: v }))}
            placeholder="벽걸이·스탠드·시스템 에어컨 청소를 빠르게 예약하세요."
          />
          <TextField
            label="설명"
            value={hero.description}
            onChange={(v) => setHero((p) => ({ ...p, description: v }))}
            placeholder="곰팡이, 냄새, 먼지 걱정 없이..."
            multiline
          />
          <TextField
            label="신뢰 배지"
            value={hero.trustBadge}
            onChange={(v) => setHero((p) => ({ ...p, trustBadge: v }))}
            placeholder="포항 지역 1,000건+ 청소 완료"
          />
          <TextField
            label="CTA 버튼 텍스트"
            value={hero.ctaText}
            onChange={(v) => setHero((p) => ({ ...p, ctaText: v }))}
            placeholder="예약 신청하기"
          />
          <TextField
            label="전화 버튼 텍스트"
            value={hero.phoneText}
            onChange={(v) => setHero((p) => ({ ...p, phoneText: v }))}
            placeholder="전화 문의"
          />
          <TextField
            label="카카오톡 버튼 텍스트"
            value={hero.kakaoText}
            onChange={(v) => setHero((p) => ({ ...p, kakaoText: v }))}
            placeholder="카카오톡 문의"
          />
          <SaveButton
            saving={saving.content_hero}
            saved={saved.content_hero}
            onClick={() => saveSection("content_hero", hero)}
          />
        </CollapsibleSection>

        {/* ─── 2. 서비스 소개 ─────────────────────────── */}
        <CollapsibleSection
          title="서비스 소개"
          badge={services.items?.length ? `${services.items.length}개 항목` : null}
          expanded={expanded.services}
          onToggle={() => toggle("services")}
        >
          <TextField
            label="섹션 제목"
            value={services.sectionTitle}
            onChange={(v) => setServices((p) => ({ ...p, sectionTitle: v }))}
          />
          <TextField
            label="섹션 설명"
            value={services.sectionDescription}
            onChange={(v) => setServices((p) => ({ ...p, sectionDescription: v }))}
            multiline
          />

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>항목 목록</h4>
          {(services.items || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setServices, "items", i)}>
              <TextField
                label="제목"
                value={item.title}
                onChange={(v) => updateArrayItem(setServices, "items", i, "title", v)}
              />
              <TextField
                label="설명"
                value={item.description}
                onChange={(v) => updateArrayItem(setServices, "items", i, "description", v)}
                multiline
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setServices, "items", { title: "", description: "" })}
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 항목 추가
          </button>
          <SaveButton
            saving={saving.content_services}
            saved={saved.content_services}
            onClick={() => saveSection("content_services", services)}
          />
        </CollapsibleSection>

        {/* ─── 3. 청소 가능 제품 ──────────────────────── */}
        <CollapsibleSection
          title="청소 가능 제품"
          badge={products.items?.length ? `${products.items.length}개 항목` : null}
          expanded={expanded.products}
          onToggle={() => toggle("products")}
        >
          <TextField
            label="섹션 제목"
            value={products.sectionTitle}
            onChange={(v) => setProducts((p) => ({ ...p, sectionTitle: v }))}
          />

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>제품 목록</h4>
          {(products.items || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setProducts, "items", i)}>
              <TextField
                label="제품명"
                value={item.name}
                onChange={(v) => updateArrayItem(setProducts, "items", i, "name", v)}
              />
              <TextField
                label="설명"
                value={item.description}
                onChange={(v) => updateArrayItem(setProducts, "items", i, "description", v)}
              />
              <TextField
                label="소요 시간"
                value={item.time}
                onChange={(v) => updateArrayItem(setProducts, "items", i, "time", v)}
                placeholder="예: 약 40분"
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() =>
              addArrayItem(setProducts, "items", { name: "", description: "", time: "" })
            }
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 항목 추가
          </button>
          <SaveButton
            saving={saving.content_products}
            saved={saved.content_products}
            onClick={() => saveSection("content_products", products)}
          />
        </CollapsibleSection>

        {/* ─── 4. 가격표 ──────────────────────────────── */}
        <CollapsibleSection
          title="가격표"
          badge={pricing.items?.length ? `${pricing.items.length}개 항목` : null}
          expanded={expanded.pricing}
          onToggle={() => toggle("pricing")}
        >
          <TextField
            label="섹션 제목"
            value={pricing.sectionTitle}
            onChange={(v) => setPricing((p) => ({ ...p, sectionTitle: v }))}
          />

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>가격 항목</h4>
          {(pricing.items || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setPricing, "items", i)}>
              <TextField
                label="유형"
                value={item.type}
                onChange={(v) => updateArrayItem(setPricing, "items", i, "type", v)}
                placeholder="예: 벽걸이 에어컨"
              />
              <TextField
                label="가격"
                value={item.price}
                onChange={(v) => updateArrayItem(setPricing, "items", i, "price", v)}
                placeholder="예: 50,000원"
              />
              <TextField
                label="설명"
                value={item.description}
                onChange={(v) => updateArrayItem(setPricing, "items", i, "description", v)}
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() =>
              addArrayItem(setPricing, "items", { type: "", price: "", description: "" })
            }
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 항목 추가
          </button>

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>참고 사항</h4>
          {(pricing.notes || []).map((note, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "8px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--color-primary)",
                  flexShrink: 0,
                }}
              >
                #{i + 1}
              </span>
              <input
                type="text"
                className="form-input"
                value={note}
                onChange={(e) => {
                  setPricing((prev) => {
                    const notes = [...(prev.notes || [])];
                    notes[i] = e.target.value;
                    return { ...prev, notes };
                  });
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  setPricing((prev) => ({
                    ...prev,
                    notes: (prev.notes || []).filter((_, j) => j !== i),
                  }));
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setPricing((prev) => ({ ...prev, notes: [...(prev.notes || []), ""] }))
            }
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
              marginBottom: "8px",
            }}
          >
            + 참고 사항 추가
          </button>

          <TextField
            label="CTA 버튼 텍스트"
            value={pricing.ctaText}
            onChange={(v) => setPricing((p) => ({ ...p, ctaText: v }))}
            placeholder="예약하기"
          />
          <SaveButton
            saving={saving.content_pricing}
            saved={saved.content_pricing}
            onClick={() => saveSection("content_pricing", pricing)}
          />
        </CollapsibleSection>

        {/* ─── 5. 작업 과정 ───────────────────────────── */}
        <CollapsibleSection
          title="작업 과정"
          badge={process.steps?.length ? `${process.steps.length}단계` : null}
          expanded={expanded.process}
          onToggle={() => toggle("process")}
        >
          <TextField
            label="섹션 제목"
            value={process.sectionTitle}
            onChange={(v) => setProcess((p) => ({ ...p, sectionTitle: v }))}
          />

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>단계 목록</h4>
          {(process.steps || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setProcess, "steps", i)}>
              <TextField
                label="단계 번호"
                value={item.step}
                onChange={(v) => updateArrayItem(setProcess, "steps", i, "step", v)}
                placeholder="예: 1"
              />
              <TextField
                label="제목"
                value={item.title}
                onChange={(v) => updateArrayItem(setProcess, "steps", i, "title", v)}
              />
              <TextField
                label="설명"
                value={item.description}
                onChange={(v) => updateArrayItem(setProcess, "steps", i, "description", v)}
                multiline
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() =>
              addArrayItem(setProcess, "steps", { step: "", title: "", description: "" })
            }
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 단계 추가
          </button>
          <SaveButton
            saving={saving.content_process}
            saved={saved.content_process}
            onClick={() => saveSection("content_process", process)}
          />
        </CollapsibleSection>

        {/* ─── 6. 고객 후기 ───────────────────────────── */}
        <CollapsibleSection
          title="고객 후기"
          badge={reviews.items?.length ? `${reviews.items.length}개 후기` : null}
          expanded={expanded.reviews}
          onToggle={() => toggle("reviews")}
        >
          <TextField
            label="섹션 제목"
            value={reviews.sectionTitle}
            onChange={(v) => setReviews((p) => ({ ...p, sectionTitle: v }))}
          />

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>후기 목록</h4>
          {(reviews.items || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setReviews, "items", i)}>
              <TextField
                label="작성자"
                value={item.name}
                onChange={(v) => updateArrayItem(setReviews, "items", i, "name", v)}
                placeholder="예: 김○○"
              />
              <TextField
                label="별점 (1~5)"
                value={item.rating}
                onChange={(v) => updateArrayItem(setReviews, "items", i, "rating", v)}
                placeholder="5"
              />
              <TextField
                label="후기 내용"
                value={item.text}
                onChange={(v) => updateArrayItem(setReviews, "items", i, "text", v)}
                multiline
              />
              <TextField
                label="날짜"
                value={item.date}
                onChange={(v) => updateArrayItem(setReviews, "items", i, "date", v)}
                placeholder="예: 2025-05-20"
              />
              <TextField
                label="에어컨 유형"
                value={item.type}
                onChange={(v) => updateArrayItem(setReviews, "items", i, "type", v)}
                placeholder="예: 벽걸이"
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() =>
              addArrayItem(setReviews, "items", {
                name: "",
                rating: "5",
                text: "",
                date: "",
                type: "",
              })
            }
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 후기 추가
          </button>
          <SaveButton
            saving={saving.content_reviews}
            saved={saved.content_reviews}
            onClick={() => saveSection("content_reviews", reviews)}
          />
        </CollapsibleSection>

        {/* ─── 6.5. 갤러리 ──────────────────────────────── */}
        <CollapsibleSection
          title="갤러리 (전후 사진)"
          badge={gallery.items?.length ? `${gallery.items.length}장` : null}
          expanded={expanded.gallery}
          onToggle={() => toggle("gallery")}
        >
          <TextField
            label="섹션 제목"
            value={gallery.sectionTitle}
            onChange={(v) => setGallery((p) => ({ ...p, sectionTitle: v }))}
          />
          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>사진 목록</h4>
          {(gallery.items || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setGallery, "items", i)}>
              <ImageUpload 
                value={item.imageSrc} 
                onChange={(url) => updateArrayItem(setGallery, "items", i, "imageSrc", url)} 
              />
              <TextField
                label="사진 라벨 (예: 작업 전)"
                value={item.label}
                onChange={(v) => updateArrayItem(setGallery, "items", i, "label", v)}
              />
              <TextField
                label="설명"
                value={item.description}
                onChange={(v) => updateArrayItem(setGallery, "items", i, "description", v)}
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setGallery, "items", { label: "", description: "", imageSrc: "" })}
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 사진 추가
          </button>
          <SaveButton
            saving={saving.content_gallery}
            saved={saved.content_gallery}
            onClick={() => saveSection("content_gallery", gallery)}
          />
        </CollapsibleSection>

        {/* ─── 7. FAQ ─────────────────────────────────── */}
        <CollapsibleSection
          title="FAQ"
          badge={faq.items?.length ? `${faq.items.length}개 질문` : null}
          expanded={expanded.faq}
          onToggle={() => toggle("faq")}
        >
          <TextField
            label="섹션 제목"
            value={faq.sectionTitle}
            onChange={(v) => setFaq((p) => ({ ...p, sectionTitle: v }))}
          />

          <h4 style={{ fontWeight: 600, fontSize: "14px", margin: "16px 0 8px" }}>질문 목록</h4>
          {(faq.items || []).map((item, i) => (
            <ItemCard key={i} index={i} onDelete={() => removeArrayItem(setFaq, "items", i)}>
              <TextField
                label="질문"
                value={item.question}
                onChange={(v) => updateArrayItem(setFaq, "items", i, "question", v)}
              />
              <TextField
                label="답변"
                value={item.answer}
                onChange={(v) => updateArrayItem(setFaq, "items", i, "answer", v)}
                multiline
              />
            </ItemCard>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setFaq, "items", { question: "", answer: "" })}
            style={{
              background: "none",
              border: "1px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "13px",
              width: "100%",
            }}
          >
            + 질문 추가
          </button>
          <SaveButton
            saving={saving.content_faq}
            saved={saved.content_faq}
            onClick={() => saveSection("content_faq", faq)}
          />
        </CollapsibleSection>

        {/* ─── 8. 예약 폼 ─────────────────────────────── */}
        <CollapsibleSection
          title="예약 폼"
          expanded={expanded.reservation}
          onToggle={() => toggle("reservation")}
        >
          <TextField
            label="섹션 제목"
            value={reservation.sectionTitle}
            onChange={(v) => setReservation((p) => ({ ...p, sectionTitle: v }))}
          />
          <TextField
            label="섹션 설명"
            value={reservation.sectionDescription}
            onChange={(v) => setReservation((p) => ({ ...p, sectionDescription: v }))}
            multiline
          />
          <SaveButton
            saving={saving.content_reservation}
            saved={saved.content_reservation}
            onClick={() => saveSection("content_reservation", reservation)}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
