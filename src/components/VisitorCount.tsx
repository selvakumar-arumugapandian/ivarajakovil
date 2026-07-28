import { useEffect, useState } from "react";

const COUNTER_GET = "https://api.counterapi.dev/v1/ivarajakovil/visits/";
const COUNTER_UP = "https://api.counterapi.dev/v1/ivarajakovil/visits/up/";
const SESSION_KEY = "ivarajakovil-visit-counted";

type CounterResponse = { count?: number };

function formatCount(n: number): string {
  return n.toLocaleString("en-IN");
}

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const already = sessionStorage.getItem(SESSION_KEY) === "1";
        const res = await fetch(already ? COUNTER_GET : COUNTER_UP, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as CounterResponse;
        if (cancelled || typeof data.count !== "number") return;
        setCount(data.count);
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* Counter is optional — keep footer usable offline */
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="footer-visitors" aria-live="polite">
      பார்வையாளர்கள்: <strong>{formatCount(count)}</strong>
    </div>
  );
}
