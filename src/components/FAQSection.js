"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { FAQ_DATA } from "@/data/siteData";

export default function FAQSection({ content }) {
  const [openIndex, setOpenIndex] = useState(null);

  const sectionTitle = content?.sectionTitle || '자주 묻는 질문';
  const sectionSubtitle = content?.sectionSubtitle || '궁금한 점이 있으시면 먼저 확인해보세요.';
  const items = content?.items ? FAQ_DATA.map((p, i) => ({...p, ...(content.items[i] || {})})) : FAQ_DATA;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          {sectionSubtitle}
        </p>

        <div className="space-y-3">
          {items.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden"
            >
              {/* 질문 */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-[0.9375rem] pr-4">
                  Q. {faq.question}
                </span>
                <HiChevronDown
                  className={`text-xl text-[var(--color-text-light)] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 답변 */}
              <div
                className={`faq-answer ${openIndex === index ? "open" : ""}`}
              >
                <div className="px-4 pb-4">
                  <p className="text-sm text-[var(--color-text-light)] leading-relaxed border-t border-[var(--color-border)] pt-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
