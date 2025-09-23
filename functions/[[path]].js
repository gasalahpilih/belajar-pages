// Belajar: redirect berdasar parameter klik iklan (fbclid/gclid/ttclid) + UTM
export async function onRequest(context) {
  const req = context.request;
  const url = new URL(req.url);

  // ====== KONFIG ======
  const MONEY_SITE = "https://t.ly/V1kWU"; // ganti target belajar lo
  const FALLBACK   = "https://google.com";          // buka manual → ke sini
  // ====================

  // ambil sinyal
  const params = url.searchParams;
  const utmSrc = (params.get("utm_source") || "").toLowerCase();
  const hasFB  = params.has("fbclid")  || utmSrc.includes("facebook") || utmSrc === "fb";
  const hasGA  = params.has("gclid")   || utmSrc.includes("google");
  const hasTT  = params.has("ttclid")  || utmSrc.includes("tiktok");

  // referer (cadangan untuk belajar — tidak selalu ada)
  const ref = (req.headers.get("referer") || "").toLowerCase();
  const refFB = ref.includes("facebook.com");
  const refGA = ref.includes("google.") || ref.includes("ads.google");
  const refTT = ref.includes("tiktok.com");

  const fromAds = hasFB || hasGA || hasTT || refFB || refGA || refTT;

  // ===== Mode DEBUG: tambahkan ?debug=1 agar tidak redirect, tapi menampilkan diagnosis =====
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
      decision: fromAds ? "TO_MONEY_SITE" : "TO_FALLBACK",
      notes: "Ini hanya untuk belajar. Jangan dipakai untuk cloaking iklan."
    };
    return new Response(
      JSON.stringify(info, null, 2),
      { headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }
  // ===========================================================================================

  // redirect sesuai keputusan
  if (fromAds) {
    return Response.redirect(MONEY_SITE + (url.search || ""), 302); // teruskan semua param (utm/gclid/ttclid)
  }
  return Response.redirect(FALLBACK, 302);
}