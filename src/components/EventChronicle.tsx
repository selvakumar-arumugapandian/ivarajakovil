import { useEffect, useMemo, useState } from "react";
import eventsData from "../content/events.json";
import { GREGORIAN_MONTHS_TA } from "../lib/tamilCalendar";
import "./EventChronicle.css";

type Photo = { src: string; captionTa: string };
type ChronicleDay = {
  id: string;
  date: string;
  dateTa: string;
  titleTa: string;
  bodyTa: string;
  photos: Photo[];
};
type ChronicleYear = {
  year: number;
  titleTa: string;
  summaryTa: string;
  days: ChronicleDay[];
};

const chronicles = [...(eventsData.chronicles as ChronicleYear[])].sort(
  (a, b) => b.year - a.year,
);

function dayParts(iso: string): { day: number; monthTa: string } {
  const [, m, d] = iso.split("-").map(Number);
  return { day: d, monthTa: GREGORIAN_MONTHS_TA[m - 1] };
}

function coverPhoto(year: ChronicleYear): Photo | null {
  for (const day of year.days) {
    if (day.photos[0]) return day.photos[0];
  }
  return null;
}

function photoCount(year: ChronicleYear): number {
  return year.days.reduce((n, day) => n + day.photos.length, 0);
}

export function EventChronicle() {
  const [yearIndex, setYearIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const year = chronicles[yearIndex];

  const selectYear = (next: number) => {
    if (next === yearIndex || next < 0 || next >= chronicles.length) return;
    setYearIndex(next);
    setFadeKey((k) => k + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightbox) setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const meta = useMemo(() => {
    if (!year || year.days.length === 0) {
      return { span: "", photos: 0 };
    }
    const first = year.days[0];
    const last = year.days[year.days.length - 1];
    const span =
      first.date === last.date ? first.dateTa : `${first.dateTa} – ${last.dateTa}`;
    return { span, photos: photoCount(year) };
  }, [year]);

  if (!year) {
    return (
      <p className="yearbook-empty">திருவிழா நினைவுகள் இன்னும் சேர்க்கப்படவில்லை.</p>
    );
  }

  return (
    <section className="yearbook" aria-label="திருவிழா நினைவு ஏடு">
      <div className="yearbook-rail" role="tablist" aria-label="ஆண்டு தேர்வு">
        {chronicles.map((item, i) => {
          const cover = coverPhoto(item);
          const active = i === yearIndex;
          return (
            <button
              key={item.year}
              type="button"
              role="tab"
              aria-selected={active}
              className={`yearbook-chip${active ? " is-active" : ""}`}
              onClick={() => selectYear(i)}
            >
              {cover ? (
                <img className="yearbook-chip-thumb" src={cover.src} alt="" />
              ) : (
                <span className="yearbook-chip-mark" aria-hidden="true" />
              )}
              <span className="yearbook-chip-text">
                <strong>{item.year}</strong>
                <small>
                  {item.days.length} {item.days.length === 1 ? "நாள்" : "நாட்கள்"}
                </small>
              </span>
            </button>
          );
        })}
      </div>

      <div key={fadeKey} className="yearbook-body">
        <header className="yearbook-intro">
          <div className="yearbook-intro-top">
            <h2>{year.titleTa}</h2>
            <span className="yearbook-badge">நடந்த நிகழ்வுகள்</span>
          </div>
          <p className="yearbook-summary">{year.summaryTa}</p>
          <p className="yearbook-meta">
            <span>{meta.span}</span>
            <span aria-hidden="true">·</span>
            <span>{year.days.length} நாட்கள்</span>
            <span aria-hidden="true">·</span>
            <span>{meta.photos} புகைப்படங்கள்</span>
          </p>
        </header>

        <div className="yearbook-table-wrap">
          <table className="yearbook-table">
            <caption>நடந்த நிகழ்வுகள் — சுருக்க அட்டவணை</caption>
            <thead>
              <tr>
                <th scope="col">நாள்</th>
                <th scope="col">நிகழ்வு</th>
                <th scope="col">புகைப்படம்</th>
              </tr>
            </thead>
            <tbody>
              {year.days.map((day) => (
                <tr key={`row-${day.id}`}>
                  <td>
                    <time dateTime={day.date}>{day.dateTa}</time>
                  </td>
                  <td>
                    <a className="yearbook-table-link" href={`#event-${day.id}`}>
                      {day.titleTa}
                    </a>
                  </td>
                  <td>
                    <span
                      className={`yearbook-photo-pill${
                        day.photos.length ? " has-photos" : ""
                      }`}
                    >
                      {day.photos.length
                        ? `${day.photos.length} படம்`
                        : "விரைவில்"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="yearbook-card-grid">
          {year.days.map((day, index) => {
            const parts = dayParts(day.date);
            return (
              <article
                key={day.id}
                id={`event-${day.id}`}
                className="yearbook-card"
              >
                <div className="yearbook-card-header">
                  <div className="yearbook-card-date" aria-hidden="true">
                    <span className="yearbook-card-day">{parts.day}</span>
                    <span className="yearbook-card-month">{parts.monthTa}</span>
                  </div>
                  <div className="yearbook-card-heading">
                    <span className="yearbook-card-daynum">நாள் {index + 1}</span>
                    <h3>{day.titleTa}</h3>
                    <time dateTime={day.date}>{day.dateTa}</time>
                  </div>
                </div>

                <div className="yearbook-card-body">
                  <p>{day.bodyTa}</p>

                  {day.photos.length > 0 ? (
                    <ul className="yearbook-photos">
                      {day.photos.map((photo) => (
                        <li key={photo.src}>
                          <button
                            type="button"
                            className="yearbook-photo"
                            onClick={() => setLightbox(photo)}
                            aria-label={photo.captionTa}
                          >
                            <img
                              src={photo.src}
                              alt={photo.captionTa}
                              loading="lazy"
                            />
                            <span>{photo.captionTa}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="yearbook-photos-empty">
                      இந்நாளுக்கான புகைப்படங்கள் விரைவில்…
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {lightbox ? (
        <div
          className="yearbook-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.captionTa}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="yearbook-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="மூடு"
          >
            ×
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.captionTa}
            onClick={(e) => e.stopPropagation()}
          />
          <p>{lightbox.captionTa}</p>
        </div>
      ) : null}
    </section>
  );
}
