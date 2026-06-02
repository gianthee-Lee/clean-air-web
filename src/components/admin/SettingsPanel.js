"use client";

import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlineExclamation } from "react-icons/hi";

const SETTING_FIELDS = [
  { key: "phone", label: "전화번호", placeholder: "010-1234-5678", description: "고객 페이지의 전화 버튼에 표시됩니다." },
  { key: "kakao_url", label: "카카오톡 채널 링크", placeholder: "https://pf.kakao.com/xxxxx", description: "비워두면 카카오톡 버튼이 자동으로 숨겨집니다." },
  { key: "business_name", label: "업체명", placeholder: "클린에어 예약센터", description: "사이트 상단과 푸터에 표시됩니다." },
  { key: "region", label: "서비스 지역", placeholder: "포항 및 인근 지역", description: "사이트 곳곳에 표시됩니다." },
  { key: "address", label: "주소", placeholder: "경북 포항시 남구 오천읍", description: "푸터에 표시됩니다." },
  { key: "operating_hours", label: "운영시간", placeholder: "평일 09:00 ~ 18:00", description: "푸터에 표시됩니다." },
  { key: "business_info", label: "사업자 정보", placeholder: "사업자등록번호: 000-00-00000 | 대표: 홍길동", description: "푸터 하단에 표시됩니다." },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [source, setSource] = useState("");

  // 비밀번호 변경
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          setSource(data.source);
        }
      } catch (err) {
        console.error("설정 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 개별 설정 저장
  const saveSetting = async (key) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: settings[key] || "" }),
      });

      if (res.ok) {
        setSaved((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (err) {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  // 비밀번호 변경
  const savePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert("비밀번호는 4자리 이상이어야 합니다.");
      return;
    }
    setSaving((prev) => ({ ...prev, password: true }));
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "admin_password", value: newPassword }),
      });

      if (res.ok) {
        setPasswordSaved(true);
        setNewPassword("");
        // 세션 비밀번호도 업데이트
        sessionStorage.setItem("admin_pw", newPassword);
        setTimeout(() => setPasswordSaved(false), 2000);
      }
    } catch (err) {
      alert("비밀번호 변경에 실패했습니다.");
    } finally {
      setSaving((prev) => ({ ...prev, password: false }));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-text-light)]">설정을 불러오는 중...</div>;
  }

  return (
    <div className="max-w-2xl">
      {/* Supabase 미설정 경고 */}
      {source === "default" && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <HiOutlineExclamation className="text-yellow-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Supabase가 연결되지 않았습니다</p>
            <p className="text-xs text-yellow-700 mt-1">
              현재 기본값이 표시되고 있습니다. 설정을 변경하려면 먼저 Supabase를 연결해주세요.
              README.md의 Supabase 설정 가이드를 참고하세요.
            </p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold mb-4">사이트 설정</h2>

      {/* 설정 필드들 */}
      <div className="space-y-4">
        {SETTING_FIELDS.map((field) => (
          <div key={field.key} className="bg-white border border-[var(--color-border)] rounded-xl p-4">
            <label className="block text-sm font-semibold mb-1">{field.label}</label>
            <p className="text-xs text-[var(--color-text-light)] mb-2">{field.description}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings[field.key] || ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="form-input flex-1"
                disabled={source === "default"}
              />
              <button
                onClick={() => saveSetting(field.key)}
                disabled={saving[field.key] || source === "default"}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                  saved[field.key]
                    ? "bg-green-500 text-white"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                }`}
              >
                {saved[field.key] ? <HiOutlineCheck /> : saving[field.key] ? "..." : "저장"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 비밀번호 변경 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">비밀번호 변경</h2>
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-4">
          <label className="block text-sm font-semibold mb-1">새 비밀번호</label>
          <p className="text-xs text-[var(--color-text-light)] mb-2">관리자 로그인 비밀번호를 변경합니다.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 (4자리 이상)"
              className="form-input flex-1"
              disabled={source === "default"}
            />
            <button
              onClick={savePassword}
              disabled={saving.password || source === "default"}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                passwordSaved
                  ? "bg-green-500 text-white"
                  : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
              }`}
            >
              {passwordSaved ? <HiOutlineCheck /> : saving.password ? "..." : "변경"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
