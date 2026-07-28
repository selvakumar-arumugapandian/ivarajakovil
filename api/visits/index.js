/**
 * Same-origin proxy so the browser is not blocked by CounterAPI CORS.
 * GET /api/visits       -> increment
 * GET /api/visits?inc=0 -> read only
 */
module.exports = async function (context, req) {
  const increment = String(req.query.inc ?? "1") !== "0";
  const target = increment
    ? "https://api.counterapi.dev/v1/ivarajakovil/visits/up/"
    : "https://api.counterapi.dev/v1/ivarajakovil/visits/";

  try {
    const upstream = await fetch(target, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!upstream.ok) {
      context.res = {
        status: 502,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body: { error: `upstream ${upstream.status}` },
      };
      return;
    }

    const data = await upstream.json();
    const count = Number(data.count ?? data.value);
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: { count: Number.isFinite(count) ? count : 0 },
    };
  } catch (err) {
    context.res = {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: { error: err instanceof Error ? err.message : "proxy failed" },
    };
  }
};
