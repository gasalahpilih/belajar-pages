# Belajar Redirect di Cloudflare Pages (pages.dev)

## Apa ini?
Project contoh untuk BELAJAR logika redirect di Cloudflare Pages Functions.
- URL root sama, tapi keputusan redirect bergantung pada parameter klik iklan:
  - `fbclid` (Facebook), `gclid` (Google Ads), `ttclid` (TikTok)
  - atau `utm_source` (facebook / tiktok / google)
- Kalau sinyal terdeteksi → redirect ke MONEY_SITE (meneruskan seluruh query)
- Kalau tidak ada sinyal → redirect ke FALLBACK (Google)
- Mode debug: tambahkan `?debug=1` untuk melihat diagnosis tanpa redirect.

> Catatan: ini untuk belajar, **bukan untuk cloaking**. Jangan dipakai untuk menipu reviewer iklan.

## Struktur
```
/
└─ functions/
   └─ [[path]].js
```

## Deploy singkat
1. Upload folder ini ke repo GitHub (mis. `belajar-pages`).
2. Cloudflare Dashboard → Pages → Create project → Connect to Git.
3. Pilih repo tadi. **Project name** isi: `gasalahpilih` agar URL jadi `https://gasalahpilih.pages.dev/`
4. Build command: None, Output dir: `/` → Deploy.

## Coba
- Manual (tanpa sinyal) → fallback:
  - `https://gasalahpilih.pages.dev/`
  - `https://gasalahpilih.pages.dev/?debug=1`
- Simulasi klik FB:
  - `https://gasalahpilih.pages.dev/?fbclid=TEST123`
  - `https://gasalahpilih.pages.dev/?fbclid=TEST123&debug=1`
- Simulasi klik Google Ads:
  - `https://gasalahpilih.pages.dev/?gclid=TEST123`
- Simulasi klik TikTok:
  - `https://gasalahpilih.pages.dev/?ttclid=TEST123`
- UTM manual:
  - `https://gasalahpilih.pages.dev/?utm_source=facebook`

## Ganti target
Buka `functions/[[path]].js` → ubah konstanta:
```js
const MONEY_SITE = "https://camaro33coin.com/register?ref=YUGOGAF02J0";
const FALLBACK   = "https://www.google.com/";
```
