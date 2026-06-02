-- 1. 고객 후기 테이블 생성
CREATE TABLE customer_reviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  aircon_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 후기 테이블 RLS 설정
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read customer_reviews" ON customer_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert customer_reviews" ON customer_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete customer_reviews" ON customer_reviews FOR DELETE USING (true);

-- 2. 갤러리 이미지 저장소(Storage Bucket) 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 갤러리 저장소 접근 정책 (RLS)
CREATE POLICY "Gallery Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Gallery Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Gallery Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');
CREATE POLICY "Gallery Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery');
