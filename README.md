# Scoutium Maç Takip Sistemi

Video tagging maç takip ve ücret hesaplama web uygulaması.

## Özellikler

- **Maç Ekleme**: Tarih, takım isimleri, süre ve ekran görüntüsü ile maç kaydı
- **Otomatik Ücret Hesaplama**: Süreye göre otomatik ücret belirleme
- **Dashboard**: Toplam, aylık ve haftalık kazanç özeti
- **Takvim Görünümü**: Aylık maç takvimi
- **Maç Listesi**: Tüm maçları listeleme, düzenleme ve silme

## Ücret Tablosu

| Süre | Ücret |
|------|-------|
| 0-25 dakika | ₺120 |
| 25-45 dakika | ₺240 |
| 45-70 dakika | ₺360 |
| 70-90 dakika | ₺480 |

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Supabase Projesi Oluştur

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'de `supabase/schema.sql` dosyasını çalıştırın
4. Storage bölümünde `screenshots` adında public bucket oluşturun

### 3. Environment Variables

`.env.local.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi ekleyin:

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Bu değerleri Supabase Dashboard > Settings > API bölümünden alabilirsiniz.

### 4. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Vercel'e Deploy

### 1. GitHub'a Push

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel'de Proje Oluştur

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" tıklayın
3. GitHub reponuzu seçin
4. Environment Variables bölümüne ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. "Deploy" tıklayın

## Supabase Storage Ayarları

Screenshots bucket için policy eklemeyi unutmayın:

1. Supabase Dashboard > Storage > screenshots
2. Policies > New Policy
3. Aşağıdaki policy'leri ekleyin:

**SELECT (Public Read)**
```sql
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'screenshots');
```

**INSERT (Upload)**
```sql
CREATE POLICY "Allow Uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'screenshots');
```

**DELETE**
```sql
CREATE POLICY "Allow Deletes" ON storage.objects 
FOR DELETE USING (bucket_id = 'screenshots');
```

## Teknolojiler

- **Next.js 14+** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database + Storage
- **date-fns** - Tarih işleme
- **Lucide React** - İkonlar

## Lisans

MIT