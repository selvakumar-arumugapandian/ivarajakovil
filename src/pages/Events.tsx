import { useMemo, useState } from "react";
import eventsData from "../content/events.json";
import { EventChronicle } from "../components/EventChronicle";
import {
  GREGORIAN_MONTHS_EN,
  GREGORIAN_MONTHS_TA,
  KADAISI_VELLI_LABEL,
  WEEKDAYS_EN,
  WEEKDAYS_TA,
  currentChithiraiYear,
  getTamilDateParts,
  getTamilYearPoojas,
  tamilCycleLabel,
  toDateKey,
} from "../lib/tamilCalendar";
import "./Events.css";

type EventsView = "kadaisi" | "chronicle";

function formatEnglishDate(date: Date): string {
  return `${date.getDate()} ${GREGORIAN_MONTHS_EN[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTamilGregorian(date: Date): string {
  return `${date.getDate()} ${GREGORIAN_MONTHS_TA[date.getMonth()]} ${date.getFullYear()}`;
}

export function Events() {
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const baseYear = currentChithiraiYear(today);

  const years = useMemo(
    () => Array.from({ length: 11 }, (_, i) => baseYear - 5 + i),
    [baseYear],
  );

  const [view, setView] = useState<EventsView>("kadaisi");
  const [selectedYear, setSelectedYear] = useState(baseYear);

  const months = useMemo(
    () => getTamilYearPoojas(selectedYear),
    [selectedYear],
  );

  const upcomingIndex = useMemo(() => {
    const key = todayKey;
    const idx = months.findIndex((m) => toDateKey(m.poojaDate) >= key);
    return idx === -1 ? months.length - 1 : idx;
  }, [months, todayKey]);

  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{eventsData.titleTa}</h1>
          <p className="lead">{eventsData.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner cal-page">
          <div className="events-tabs" role="tablist" aria-label="நிகழ்வு பார்வை">
            <button
              type="button"
              role="tab"
              className={`events-tab${view === "kadaisi" ? " is-active" : ""}`}
              aria-selected={view === "kadaisi"}
              onClick={() => setView("kadaisi")}
            >
              கடைசி வெள்ளி
            </button>
            <button
              type="button"
              role="tab"
              className={`events-tab${view === "chronicle" ? " is-active" : ""}`}
              aria-selected={view === "chronicle"}
              onClick={() => setView("chronicle")}
            >
              திருவிழா நினைவுகள்
            </button>
          </div>

          {view === "chronicle" ? (
            <EventChronicle />
          ) : (
            <section className="kadaisi-layout" aria-label={KADAISI_VELLI_LABEL}>
              <nav className="kadaisi-years" aria-label="ஆண்டு தேர்வு">
                <p className="kadaisi-years-label">ஆண்டு</p>
                <ul>
                  {years.map((year) => {
                    const active = year === selectedYear;
                    return (
                      <li key={year}>
                        <button
                          type="button"
                          className={`kadaisi-year-btn${active ? " is-active" : ""}`}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setSelectedYear(year)}
                        >
                          <strong>{tamilCycleLabel(year)}</strong>
                          <small>சித்திரை {year}</small>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="kadaisi-main">
                <nav className="kadaisi-breadcrumb" aria-label="வழித்தடம்">
                  <span>நிகழ்வுகள்</span>
                  <span aria-hidden="true">›</span>
                  <span>கடைசி வெள்ளி</span>
                  <span aria-hidden="true">›</span>
                  <strong>{tamilCycleLabel(selectedYear)}</strong>
                </nav>

                <header className="kadaisi-intro">
                  <h2>{KADAISI_VELLI_LABEL}</h2>
                  <p>
                    ஒவ்வொரு தமிழ் மாதத்தின் கடைசி வெள்ளிக்கிழமை — ஆண்டு{" "}
                    {tamilCycleLabel(selectedYear)} (சித்திரை {selectedYear} முதல்).
                  </p>
                </header>

                <div className="kadaisi-card-grid">
                  {months.map((item, index) => {
                    const pooja = item.poojaDate;
                    const tamil = getTamilDateParts(pooja);
                    const key = toDateKey(pooja);
                    const isPast = key < todayKey;
                    const isToday = key === todayKey;
                    const isNext = index === upcomingIndex && !isPast;

                    return (
                      <article
                        key={`${selectedYear}-${item.monthIndex}`}
                        className={[
                          "kadaisi-card",
                          isPast ? "is-past" : "",
                          isToday ? "is-today" : "",
                          isNext ? "is-next" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="kadaisi-card-header">
                          <div className="kadaisi-card-date" aria-hidden="true">
                            <span className="kadaisi-card-day">
                              {pooja.getDate()}
                            </span>
                            <span className="kadaisi-card-month">
                              {GREGORIAN_MONTHS_EN[pooja.getMonth()].slice(0, 3)}
                            </span>
                          </div>
                          <div className="kadaisi-card-heading">
                            <span className="kadaisi-card-tag">{item.monthName}</span>
                            <h3>{KADAISI_VELLI_LABEL}</h3>
                            <p className="kadaisi-card-en">
                              {WEEKDAYS_EN[pooja.getDay()]}, {formatEnglishDate(pooja)}
                            </p>
                          </div>
                        </div>

                        <div className="kadaisi-card-body">
                          <dl className="kadaisi-meta">
                            <div>
                              <dt>தமிழ் நாள்</dt>
                              <dd>
                                {tamil.monthName} {tamil.day} · {WEEKDAYS_TA[pooja.getDay()]}
                              </dd>
                            </div>
                            <div>
                              <dt>ஆங்கில நாள்</dt>
                              <dd>{formatTamilGregorian(pooja)}</dd>
                            </div>
                          </dl>

                          {isToday ? (
                            <span className="kadaisi-status is-live">இன்று</span>
                          ) : isNext ? (
                            <span className="kadaisi-status is-upcoming">அடுத்த பூஜை</span>
                          ) : isPast ? (
                            <span className="kadaisi-status">நடந்தது</span>
                          ) : (
                            <span className="kadaisi-status is-upcoming">வரவிருக்கும்</span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
