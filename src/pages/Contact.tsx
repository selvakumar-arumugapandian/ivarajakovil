import { Link } from "react-router-dom";
import temple from "../content/temple.json";
import { Reveal } from "../components/Reveal";
import { TempleMap } from "../components/TempleMap";
import "./Pages.css";

export function Contact() {
  const { contact } = temple;

  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>தொடர்பு</h1>
          <p className="lead">முகவரி · வரைபடம் · வழிகாட்டி</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner contact-grid">
          <Reveal>
            <dl className="contact-details">
              <div>
                <dt>முகவரி</dt>
                <dd>{contact.addressTa}</dd>
              </div>

              <div>
                <dt>பகுதி</dt>
                <dd>{contact.areaTa}</dd>
              </div>

              <div>
                <dt>வருகை</dt>
                <dd>
                  {contact.visitNoteTa}{" "}
                  <Link to="/events">நிகழ்வுகள் →</Link>
                </dd>
              </div>

              <div>
                <dt>வழிகாட்டி</dt>
                <dd>
                  <p className="contact-hint">
                    உங்கள் இடத்திலிருந்து வழிகாட்டலை Google Maps திறக்கும்.
                  </p>
                  <a
                    className="btn btn-primary contact-directions"
                    href={contact.directionsLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    வழிகாட்டலைத் திற
                  </a>
                  <p className="contact-map-alt">
                    <a href={contact.mapLink} target="_blank" rel="noreferrer">
                      வரைபடத்தில் இடத்தைக் காண
                    </a>
                  </p>
                </dd>
              </div>
            </dl>
          </Reveal>

          {/* Not wrapped in Reveal — map should start loading immediately */}
          <TempleMap />
        </div>
      </div>
    </>
  );
}
