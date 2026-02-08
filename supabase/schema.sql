-- Scoutium Match Tracker Database Schema
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Matches tablosu
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  team_home TEXT NOT NULL,
  team_away TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 120),
  price DECIMAL(10,2) NOT NULL,
  screenshot_url TEXT,
  notes TEXT
);

-- RLS (Row Level Security) - Public erişim (tek kullanıcı için)
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Herkesin okuma/yazma yapabilmesi için policy
-- NOT: Production'da auth ile sınırlandırın
CREATE POLICY "Enable all access for all users" ON public.matches
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS matches_date_idx ON public.matches(date DESC);
CREATE INDEX IF NOT EXISTS matches_created_at_idx ON public.matches(created_at DESC);

-- Storage bucket oluşturma (Supabase Dashboard'dan da yapılabilir)
-- Bu komut SQL Editor'de çalışmayabilir, Dashboard'dan oluşturun
-- INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- Storage policy (screenshot bucket için)
-- Dashboard > Storage > screenshots bucket > Policies
-- Aşağıdaki policy'leri ekleyin:
-- 1. SELECT: Herkese izin ver (public bucket)
-- 2. INSERT: Herkese izin ver
-- 3. DELETE: Herkese izin ver

COMMENT ON TABLE public.matches IS 'Scoutium video tagging maç kayıtları';
COMMENT ON COLUMN public.matches.duration_minutes IS 'Maç süresi (dakika)';
COMMENT ON COLUMN public.matches.price IS 'Ücret (TL)';
COMMENT ON COLUMN public.matches.screenshot_url IS 'Ekran görüntüsü URL (Supabase Storage)';
