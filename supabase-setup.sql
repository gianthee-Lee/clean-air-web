/**
 * ============================================================
 * 📌 Supabase 테이블 생성 SQL
 * ============================================================
 *
 * Supabase 대시보드 → SQL Editor에서 이 내용을 실행하세요.
 * ============================================================
 */

-- 1. 예약 테이블
CREATE TABLE reservations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  aircon_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  preferred_date TEXT,
  preferred_time TEXT,
  memo TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예약 테이블에 누구나 INSERT 가능 (고객 예약용)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Anyone can update reservations" ON reservations FOR UPDATE USING (true);

-- 2. 사이트 설정 테이블
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 설정 테이블 RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert settings" ON site_settings FOR INSERT WITH CHECK (true);

-- 3. 초기 설정값 입력
INSERT INTO site_settings (key, value) VALUES
  ('phone', '010-1234-5678'),
  ('kakao_url', ''),
  ('business_name', '클린에어 예약센터'),
  ('region', '포항 및 인근 지역'),
  ('address', '경북 포항시 남구 오천읍'),
  ('operating_hours', '평일 09:00 ~ 18:00 | 토요일 09:00 ~ 15:00'),
  ('business_info', '사업자등록번호: 000-00-00000 | 대표: 홍길동'),
  ('admin_password', 'admin1234');
