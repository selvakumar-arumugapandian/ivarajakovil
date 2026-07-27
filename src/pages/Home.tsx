import { Link } from "react-router-dom";
import temple from "../content/temple.json";
import story from "../content/story.json";
import eventsData from "../content/events.json";
import galleryData from "../content/gallery.json";
import { Reveal } from "../components/Reveal";
import { BookDownload } from "../components/BookDownload";
import "./Home.css";
import "../components/BookDownload.css";

export function Home() {
  const upcoming = eventsData.events
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);
  const peek = galleryData.photos.slice(0, 3);

  return (
    <>
      <section className="hero" aria-label="திருக்கோயில் முகப்பு">
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
            <div className="btn-group">
              <Link className="btn btn-primary" to="/story">
                கதை
              </Link>
              <Link className="btn btn-ghost" to="/villupaattu">
                வில்லுப்பாட்டு
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-intro">
        <div className="section-inner">
          <Reveal className="home-intro-grid">
            <div className="section-head">
              <h2>திருக்கோயில் அறிமுகம்</h2>
              <hr className="gold-rule" />
              <p className="lead">{temple.introTa}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section home-story">
        <div className="section-inner">
          <Reveal className="section-head">
            <h2>ஐவர் ராசாக்கள் கதை</h2>
            <hr className="gold-rule" />
            <p className="lead">
              தலைப்புகளாகப் பிரித்த முழுக் கதை, வில்லுப்பாட்டு, நூல் பதிவிறக்கம்
            </p>
          </Reveal>
          <BookDownload book={story.book} />
          <div className="btn-group" style={{ marginTop: "1rem" }}>
            <Link className="btn btn-primary" to="/story">
              கதையைப் படிக்க
            </Link>
            <Link className="btn btn-outline" to="/villupaattu">
              வில்லுப்பாட்டு
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-events">
        <div className="section-inner">
          <Reveal className="section-head">
            <h2>வரவிருக்கும் நிகழ்வுகள்</h2>
            <hr className="gold-rule" />
            <p className="lead">அடுத்த திருவிழாக்களும் சிறப்பு பூஜைகளும்</p>
          </Reveal>

          <Reveal as="ul" className="event-list">
            {upcoming.map((event) => (
              <li key={event.id} className="event-item">
                <div className="event-date">{event.dateTa}</div>
                <div>
                  <h3>{event.titleTa}</h3>
                  <p>{event.bodyTa}</p>
                </div>
              </li>
            ))}
          </Reveal>

          <div className="section-cta">
            <Link className="btn btn-primary" to="/events">
              அனைத்து நிகழ்வுகளும்
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-gallery">
        <div className="section-inner">
          <Reveal className="section-head">
            <h2>தரிசனப் பார்வை</h2>
            <hr className="gold-rule" />
            <p className="lead">திருக்கோயில் புகைப்படங்களிலிருந்து ஒரு சிறிய தேர்வு</p>
          </Reveal>

          <Reveal className="gallery-peek-grid">
            {peek.map((photo) => (
              <Link key={photo.id} to="/gallery" title={photo.captionTa}>
                <img src={photo.src} alt={photo.captionTa} loading="lazy" />
              </Link>
            ))}
          </Reveal>

          <div className="section-cta">
            <Link className="btn btn-ghost" to="/gallery">
              முழு தொகுப்பு
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
