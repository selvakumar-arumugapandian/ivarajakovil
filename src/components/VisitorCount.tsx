import { useEffect, useState } from "react";

const SESSION_KEY = "ivarajakovil-visit-counted";
const CACHE_KEY = "ivarajakovil-visit-count";

function readCachedCount(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : null;
  } catch {
    return null;
  }
}

function writeCachedCount(n: number) {
  try {
    localStorage.setItem(CACHE_KEY, String(n));
  } catch {
    /* ignore */
  }
}

function parseCount(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const raw = record.count ?? record.value;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

async function fetchCount(increment: boolean, signal: AbortSignal): Promise<number> {
  const url = increment ? "/api/visits" : "/api/visits?inc=0";
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    signal,
  });
  if (!res.ok) throw new Error(`Counter HTTP ${res.status}`);
  const data: unknown = await res.json();
  const n = parseCount(data);
  if (n === null) throw new Error("Counter payload missing count");
  return n;
}

function formatCount(n: number): string {
  return n.toLocaleString("en-IN");
}

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(() => readCachedCount());
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        let already = false;
        try {
          already = sessionStorage.getItem(SESSION_KEY) === "1";
        } catch {
          already = false;
        }

        const n = await fetchCount(!already, controller.signal);
        setCount(n);
        setFailed(false);
        writeCachedCount(n);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const cached = readCachedCount();
        if (cached !== null) {
          setCount(cached);
          setFailed(false);
        } else {
          setFailed(true);
        }
        console.warn("Visitor count unavailable", err);
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  const label =
    count === null && !failed
      ? "…"
      : count === null
        ? "—"
        : formatCount(count);

  return (
    <p className="footer-visitors" aria-live="polite">
      <span className="footer-visitors-label">பார்வையாளர்கள்</span>
      <strong className="footer-visitors-count">{label}</strong>
    </p>
  );
}
