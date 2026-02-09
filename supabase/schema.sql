-- Scoutium Match Tracker Database Schema
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Mevcut tabloyu silmek için (DİKKAT: Tüm veriler silinir!)
-- DROP TABLE IF EXISTS public.matches;

-- Matches tablosu (user_id ile)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  team_home TEXT NOT NULL,
  team_away TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 120),
  price DECIMAL(10,2) NOT NULL,
  screenshot_url TEXT,
  notes TEXT
);

-- RLS (Row Level Security) - Kullanıcıya özel erişim
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi maçlarını görebilir
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcı sadece kendi maçlarını ekleyebilir
CREATE POLICY "Users can insert own matches" ON public.matches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcı sadece kendi maçlarını güncelleyebilir
CREATE POLICY "Users can update own matches" ON public.matches
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Kullanıcı sadece kendi maçlarını silebilir
CREATE POLICY "Users can delete own matches" ON public.matches
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS matches_user_id_idx ON public.matches(user_id);
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
COMMENT ON COLUMN public.matches.user_id IS 'Maçı ekleyen kullanıcı';
COMMENT ON COLUMN public.matches.duration_minutes IS 'Maç süresi (dakika)';
COMMENT ON COLUMN public.matches.price IS 'Ücret (TL)';
COMMENT ON COLUMN public.matches.screenshot_url IS 'Ekran görüntüsü URL (Supabase Storage)';

-- ==========================================
-- MEVCUT TABLOYU GÜNCELLEMEK İÇİN:
-- ==========================================
-- Eğer mevcut bir tablonuz varsa ve user_id eklemek istiyorsanız:
--
-- 1. user_id kolonu ekle:
-- ALTER TABLE public.matches ADD COLUMN user_id UUID REFERENCES auth.users(id);
--
-- 2. Mevcut kayıtları bir kullanıcıya ata (kendi user_id'nizi girin):
-- UPDATE public.matches SET user_id = 'YOUR-USER-ID-HERE' WHERE user_id IS NULL;
--
-- 3. user_id'yi zorunlu yap:
-- ALTER TABLE public.matches ALTER COLUMN user_id SET NOT NULL;
--
-- 4. Eski policy'i sil ve yenilerini ekle:
-- DROP POLICY IF EXISTS "Enable all access for all users" ON public.matches;
-- (Yukarıdaki CREATE POLICY komutlarını çalıştırın)
