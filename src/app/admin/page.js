"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineLockClosed } from "react-icons/hi";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 로그인 성공 → 세션에 저장
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_pw", password);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("서버에 연결할 수 없습니다. Supabase 설정을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-alt)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
              <HiOutlineLockClosed className="text-3xl text-[var(--color-primary)]" />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">관리자 로그인</h1>
            <p className="text-sm text-[var(--color-text-light)] mt-1">
              클린에어 예약센터 관리 페이지
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="admin-password" className="form-label">비밀번호</label>
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 비밀번호를 입력하세요"
                className="form-input"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? "확인 중..." : "로그인"}
            </button>
          </form>

          <p className="text-xs text-center text-[var(--color-text-light)] mt-6">
            초기 비밀번호: admin1234
          </p>
        </div>
      </div>
    </div>
  );
}
