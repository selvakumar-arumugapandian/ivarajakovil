import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import story from "../content/story.json";
import { BookDownload } from "../components/BookDownload";
import "./Story.css";
import "../components/BookDownload.css";

export function Story() {
  const chapters = story.chapters;
  const [index, setIndex] = useState(0);
  const [flipClass, setFlipClass] = useState("");
  const chapter = chapters[index];
  const total = chapters.length;

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
          <h1>{story.titleTa}</h1>
          <p className="lead">{story.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body story-page">
        <div className="page-body-inner">
          <BookDownload book={story.book} />

          <p className="source-note">{story.sourceNoteTa}</p>

          <div className="flipbook">
            <aside className="flipbook-toc" aria-label="கதைத் தலைப்புகள்">
              <h2 className="flipbook-toc-title">தலைப்புகள்</h2>
              <ol className="flipbook-toc-list">
                {chapters.map((item, i) => (
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
                <span className="sr-only">தலைப்பு தேர்வு</span>
                <select
                  value={index}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    goTo(next, next > index ? "next" : "prev");
                  }}
                >
                  {chapters.map((item, i) => (
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
                <h2>{chapter.titleTa}</h2>
                {chapter.bodyTa.split("\n\n").map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
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

          <div className="related-links">
            <Link className="btn btn-outline" to="/villupaattu">
              வில்லுப்பாட்டு
            </Link>
            <Link className="btn btn-outline" to="/history">
              கோயில் வரலாறு
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
