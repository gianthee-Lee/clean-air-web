"use client";

import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_ITEMS = [
  { label: "서비스", href: "/#services" },
  { label: "가격", href: "/#pricing" },
  { label: "과정", href: "/#process" },
  { label: "후기", href: "/reviews" },
];

export default function Header({ businessName = "클린에어 예약센터" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl">❄️</span>
          <span className="font-bold text-lg text-[var(--color-primary-dark)]">
            {businessName}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a href="/reservation" className="btn btn-primary text-sm !py-2 !px-4">
            예약하기
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-[var(--color-text)]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 열기"
        >
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-[var(--color-border)] shadow-lg">
          <nav className="flex flex-col px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="py-3 text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] border-b border-[var(--color-border)] last:border-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
