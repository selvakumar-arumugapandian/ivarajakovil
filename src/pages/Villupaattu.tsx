import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import villu from "../content/villupaattu.json";
import { BookDownload } from "../components/BookDownload";
import "./Flipbook.css";
import "../components/BookDownload.css";

export function Villupaattu() {
  const parts = villu.parts;
  const [index, setIndex] = useState(0);
  const [flipClass, setFlipClass] = useState("");
  const part = parts[index];
  const total = parts.length;

  const goTo = (next: number, direction: "next" | "prev") => {
    if (next < 0 || next >= total || next === index) return;
    setFlipClass(direction === "next" ? "is-flip-next" : "is-flip-prev");
    window.setTimeout(() => {
      setIndex(next);
      setFlipClass("");
    }, 220);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && index < total - 1) {
        setFlipClass("is-flip-next");
        window.setTimeout(() => {
          setIndex((i) => Math.min(i + 1, total - 1));
          setFlipClass("");
        }, 220);
      }
      if (e.key === "ArrowLeft" && index > 0) {
        setFlipClass("is-flip-prev");
        window.setTimeout(() => {
          setIndex((i) => Math.max(i - 1, 0));
          setFlipClass("");
        }, 220);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total]);

  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{villu.titleTa}</h1>
          <p className="lead">{villu.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body flipbook-wrap">
        <div className="page-body-inner">
          <BookDownload book={villu.book} />

          <p className="source-note">{villu.introTa}</p>
          <p className="source-note">{villu.sourceNoteTa}</p>

          <div className="flipbook">
            <aside className="flipbook-toc" aria-label="வில்லுப்பாட்டுச் செய்யுள்">
              <h2 className="flipbook-toc-title">செய்யுள் பகுதிகள்</h2>
              <ol className="flipbook-toc-list">
                {parts.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={i === index ? "is-active" : undefined}
                      onClick={() => goTo(i, i > index ? "next" : "prev")}
                    >
                      <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
                      <span>{item.titleTa}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="flipbook-stage">
              <label className="flipbook-mobile-select">
                <span className="sr-only">பகுதி தேர்வு</span>
                <select
                  value={index}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    goTo(next, next > index ? "next" : "prev");
                  }}
                >
                  {parts.map((item, i) => (
                    <option key={item.id} value={i}>
                      {i + 1}. {item.titleTa}
                    </option>
                  ))}
                </select>
              </label>

              <article className={`flipbook-page ${flipClass}`.trim()} aria-live="polite">
                <div className="flipbook-page-meta">
                  பக்கம் {index + 1} / {total}
                </div>
                <h2>{part.titleTa}</h2>
                <div className="flipbook-verse">
                  {part.bodyTa.split("\n").map((line, lineIndex) => {
                    const trimmed = line.trim();
                    if (!trimmed) {
                      return <div key={`${part.id}-${lineIndex}`} className="verse-gap" />;
                    }
                    const isMeter =
                      /^(?:\(?வேறு\)?|அடி வேறு|விருத்தம்|.*சிந்து.*)$/u.test(trimmed) &&
                      trimmed.length < 24;
                    return (
                      <p
                        key={`${part.id}-${lineIndex}`}
                        className={isMeter ? "is-meter" : undefined}
                      >
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              </article>

              <div className="flipbook-nav">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={index === 0}
                  onClick={() => goTo(index - 1, "prev")}
                >
                  ← முந்தையது
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={index === total - 1}
                  onClick={() => goTo(index + 1, "next")}
                >
                  அடுத்தது →
                </button>
              </div>
            </div>
          </div>

          <p className="source-note" style={{ marginTop: "2rem" }}>
            {villu.performanceNoteTa}
          </p>

          <div className="related-links">
            <Link className="btn btn-outline" to="/varalaru">
              வரலாறு
            </Link>
            <a
              className="btn btn-outline"
              href={villu.book.file}
              download="ஐவர்_ராசாக்கள்_கதை.pdf"
            >
              PDF நூல்
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
