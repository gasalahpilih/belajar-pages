Cloudflare Pages Redirect Function
Apa ini?
Project ini adalah contoh implementasi conditional redirect menggunakan Cloudflare Pages Functions untuk menangani traffic dari berbagai sumber dengan logika routing yang berbeda.
Fitur Utama:

Parameter Detection: Mendeteksi traffic berdasarkan parameter URL seperti:

fbclid (Facebook), gclid (Google Ads), ttclid (TikTok)
utm_source (facebook/tiktok/google)


Referer Analysis: Menganalisis header referer untuk identifikasi sumber traffic
Smart Routing: Mengarahkan traffic ke tujuan yang berbeda berdasarkan sumber
Asset Handling: Menangani file statis (CSS, JS, images) dengan proper fallback
Debug Mode: Fitur debugging dengan parameter ?debug=1

Cara Kerja:
Visitor → Domain → Function Logic:
├─ Traffic dari Ads → Redirect ke Money Site
├─ Traffic Organic → Serve Landing Page
└─ Asset Request → Serve Static Files
Struktur Project
/
└─ functions/
   └─ [[path]].js
Setup & Deployment
1. Persiapan Repository
Upload folder project ke GitHub repository (contoh: redirect-pages).
2. Cloudflare Pages Setup

Buka Cloudflare Dashboard → Pages → Create project → Connect to Git
Pilih repository yang sudah dibuat
Project name: your-project-name (URL akan jadi https://your-project.pages.dev/)
Build command: None
Output directory: /
Deploy!

3. Environment Variables (Optional)
Bisa ditambahkan melalui Pages Settings:

MONEY_SITE: URL tujuan redirect
FALLBACK_PAGE: Halaman fallback default

Konfigurasi
Edit file functions/[[path]].js:
javascript// ====== KONFIG ======
const MONEY_SITE = "https://your-money-site.com";
const FALLBACK = "/index.html";
// ====================
Testing
Debug Mode
Akses: https://your-domain.com/?debug=1
Response akan menampilkan:

URL yang diakses
Parameter yang terdeteksi
Referer header
Logic decision yang diambil

Test Cases

?fbclid=123 → Should redirect to money site
?utm_source=google → Should redirect to money site
Normal visit → Should serve index page

Custom Domain

Pages → Custom domains → Set up a custom domain
Add your domain dan verify DNS
SSL akan otomatis aktif

Monitoring & Analytics

Gunakan Cloudflare Analytics untuk monitoring traffic
Check Functions metrics untuk performance
Setup alerts untuk error monitoring

Best Practices

Selalu test dengan parameter ?debug=1 sebelum production
Monitor performance metrics secara berkala
Backup konfigurasi sebelum update major
Gunakan version control untuk track changes


Note: Project ini dibuat untuk keperluan pembelajaran dan testing. Pastikan implementasi sesuai dengan kebijakan platform yang digunakan.
