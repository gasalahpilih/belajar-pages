// Redirect hanya untuk klik iklan (Google Ads, FB Ads, TikTok Ads)
export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);

  // ====== KONFIG ======
  const MONEY_SITE = "https://t.ly/V1kWU"; // target redirect
  const FALLBACK   = "index.html";         // file fallback (dibuka langsung)
  // ====================

  // ambil parameter
  const params = url.searchParams;
  const utmSrc = (params.get("utm_source") || "").toLowerCase();

  // deteksi param iklan
  const hasFB  = params.has("fbclid")  || utmSrc.includes("facebook") || utmSrc === "fb";
  const hasGA  = params.has("gclid")   || utmSrc.includes("google");
  const hasTT  = params.has("ttclid")  || utmSrc.includes("tiktok");

  // deteksi referer (cadangan)
  const ref = (req.headers.get("referer") || "").toLowerCase();
  const refFB = ref.includes("facebook.com");
  const refGA = ref.includes("google.") || ref.includes("ads.google");
  const refTT = ref.includes("tiktok.com");

  const fromAds = hasFB || hasGA || hasTT || refFB || refGA || refTT;

  // ===== Mode DEBUG =====
  if ((params.get("debug") || "") === "1") {
    const info = {
      url: url.toString(),
      query: Object.fromEntries(params.entries()),
      referer: ref || "(kosong)",
      detected: {
        fb: hasFB || refFB,
        google: hasGA || refGA,
        tiktok: hasTT || refTT,
        fromAds
      },
      decision: fromAds ? "TO_MONEY_SITE" : "SERVE_INDEX",
      notes: "Hanya redirect kalau dari iklan FB/Google/TikTok."
    };
    return new Response(
      JSON.stringify(info, null, 2),
      { headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }
  // ======================

  // eksekusi redirect atau serve normal
  if (fromAds) {
    return Response.redirect(MONEY_SITE + (url.search || ""), 302);
  } else {
    return context.env.ASSETS.fetch(new URL(FALLBACK, url)); 
    // ini cara Cloudflare Worker serve index.html langsung (tanpa redirect)
  }
}
