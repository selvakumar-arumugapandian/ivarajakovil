import { useEffect, useState } from "react";
import galleryData from "../content/gallery.json";
import { Reveal } from "../components/Reveal";
import "./Pages.css";

type Photo = (typeof galleryData.photos)[number];

export function Gallery() {
  const [active, setActive] = useState<Photo | null>(null);
  const videos = galleryData.videos.filter((video) => Boolean(video.url?.trim()));
  const pageTitle =
    videos.length > 0 ? galleryData.titleTa : "புகைப்படங்கள்";
  const pageLead =
    videos.length > 0
      ? galleryData.subtitleTa
      : "திருக்கோயில் தரிசனங்களும் திருவிழா நினைவுகளும்";

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{pageTitle}</h1>
          <p className="lead">{pageLead}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <Reveal className="gallery-grid">
            {galleryData.photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className="gallery-tile"
                onClick={() => setActive(photo)}
              >
                <figure>
                  <img src={photo.src} alt={photo.captionTa} loading="lazy" />
                  <figcaption>
                    <h3>{photo.captionTa}</h3>
                  </figcaption>
                </figure>
              </button>
            ))}
          </Reveal>

          {videos.length > 0 ? (
            <div className="video-block">
              <h2 className="group-label">காணொளிகள்</h2>
              {videos.map((video) => (
                <Reveal key={video.id}>
                  <h3 style={{ marginTop: "1rem", color: "var(--temple-deep)" }}>
                    {video.titleTa}
                  </h3>
                  {video.noteTa ? (
                    <p className="note-banner" style={{ marginTop: "0.75rem" }}>
                      {video.noteTa}
                    </p>
                  ) : null}
                  <div className="video-frame">
                    <iframe
                      src={video.url}
                      title={video.titleTa}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {active && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.captionTa}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="மூடு"
            onClick={() => setActive(null)}
          >
            ×
          </button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.captionTa} />
            <div className="lightbox-caption">{active.captionTa}</div>
          </div>
        </div>
      )}
    </>
  );
}
