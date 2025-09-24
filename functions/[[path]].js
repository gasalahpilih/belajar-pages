export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // ====== KONFIG ======
  const MONEY_SITE = "https://t.ly/V1kWU";
  const FALLBACK = "/index.html"; // selalu absolute path
  // ====================

  // 1) Coba serve static asset dulu (css/js/img/favicon dll)
  try {
    const assetResp = await env.ASSETS.fetch(request);
    // kalau ada file statis (bukan 404), langsung return
    if (assetResp && assetResp.status !== 404) {
      return assetResp;
    }
    // else: lanjut ke logic di bawah
  } catch (e) {
    // ignore, lanjut ke logic
    console.log("assets fetch error:", e);
  }

  // Ambil parameter & header yang dibutuhkan
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

  // DEBUG mode
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
    };
    return new Response(JSON.stringify(info, null, 2), { headers: { "content-type": "application/json; charset=utf-8" }});
  }

  // Hanya apply redirect logic untuk request navigasi (browser page loads)
  const accept = (request.headers.get("accept") || "").toLowerCase();
  const isNavigation = accept.includes("text/html");

  if (isNavigation) {
    if (fromAds) {
      // redirect ke money site, teruskan query string
      return Response.redirect(MONEY_SITE + (url.search || ""), 302);
    } else {
      // serve index.html (SPA fallback)
      // pastikan path absolute supaya ASSETS.fetch bisa menangkap file
      return env.ASSETS.fetch(new Request(new URL(FALLBACK, url).toString(), request));
    }
  }

  // Non-navigation and asset not found -> return 404 HTML or empty response
  return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" }});
}
