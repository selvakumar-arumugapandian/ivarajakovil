import { Link } from "react-router-dom";
import temple from "../content/temple.json";
import { Reveal } from "../components/Reveal";
import {
  GREGORIAN_MONTHS_TA,
  KADAISI_VELLI_LABEL,
  WEEKDAYS_TA,
  getTamilDateParts,
  getUpcomingKadaisiPoojas,
  toDateKey,
} from "../lib/tamilCalendar";
import "./Home.css";

type PathwayIcon = "scroll" | "music" | "calendar" | "camera" | "map";

function PathwayGlyph({ name }: { name: PathwayIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "scroll":
      return (
        <svg {...common}>
          <path d="M8 4h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8" />
          <path d="M8 4a2 2 0 0 0-2 2v14" />
          <path d="M6 20h10" />
          <path d="M10 9h6M10 13h4" />
        </svg>
      );
    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V6l10-2v12" />
          <circle cx="7" cy="18" r="2.5" />
          <circle cx="17" cy="16" r="2.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
          <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4z" />
          <circle cx="12" cy="13" r="3.2" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
          <circle cx="12" cy="11" r="2.2" />
        </svg>
      );
    default:
      return null;
  }
}

export function Home() {
  const today = new Date();
  const upcoming = getUpcomingKadaisiPoojas(today, 2);

  return (
    <>
      <section className="hero" aria-label="திருக்கோயில் முகப்பு">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-media">
            <img
              src={temple.heroImage}
              alt={`${temple.nameTa} — மூலவர் தரிசனம்`}
              width={682}
              height={1024}
              fetchPriority="high"
            />
          </div>
          <div className="hero-content">
            <h1 className="hero-brand">{temple.nameTa}</h1>
            <p className="hero-place">{temple.placeTa}</p>
            <p className="hero-tagline">{temple.taglineTa}</p>
          </div>
        </div>
      </section>

      <section className="section home-explore">
        <div className="section-inner">
          <Reveal className="section-head home-explore-head">
            <h2>ஆராயுங்கள்</h2>
            <hr className="gold-rule" />
            <p className="lead">{temple.welcomeTa}</p>
          </Reveal>

          <Reveal as="ul" className="home-card-grid">
            {temple.pathways.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="home-card">
                  <span className="home-card-icon">
                    <PathwayGlyph name={item.icon as PathwayIcon} />
                  </span>
                  <span className="home-card-copy">
                    <strong>{item.titleTa}</strong>
                    <span>{item.bodyTa}</span>
                  </span>
                  <span className="home-card-go" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section home-events">
        <div className="section-inner">
          <Reveal className="section-head">
            <h2>வரவிருக்கும் நிகழ்வுகள்</h2>
            <hr className="gold-rule" />
            <p className="lead">அடுத்த இரண்டு கடைசி வெள்ளி பூஜைகள் — தேதி கடந்ததும் தானாக மாறும்</p>
          </Reveal>

          {upcoming.length === 0 ? (
            <Reveal className="home-events-empty">
              <p>அடுத்த நிகழ்வுகள் இன்னும் கணக்கிடப்படவில்லை.</p>
              <Link className="btn btn-outline" to="/events">
                நிகழ்வுகள் பக்கம்
              </Link>
            </Reveal>
          ) : (
            <Reveal as="ul" className="home-event-grid">
              {upcoming.map((item) => {
                const pooja = item.poojaDate;
                const key = toDateKey(pooja);
                const tamil = getTamilDateParts(pooja);
                const isToday = key === toDateKey(today);

                return (
                  <li key={key}>
                    <Link to="/events" className="home-event-card">
                      <time dateTime={key}>
                        {WEEKDAYS_TA[pooja.getDay()]} · {tamil.monthName}{" "}
                        {tamil.day}
                      </time>
                      <strong>{KADAISI_VELLI_LABEL}</strong>
                      <p>
                        {item.monthName} மாதம் · {pooja.getDate()}{" "}
                        {GREGORIAN_MONTHS_TA[pooja.getMonth()]}{" "}
                        {pooja.getFullYear()}
                      </p>
                      <span className="home-event-cta">
                        {isToday ? "இன்று · " : ""}
                        நிகழ்வுகள் பக்கம் →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </Reveal>
          )}

          <div className="section-cta">
            <Link className="btn btn-primary" to="/events">
              அனைத்து கடைசி வெள்ளி தேதிகள்
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
