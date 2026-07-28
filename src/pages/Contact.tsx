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
          <p className="lead">முகவரி · வரைபடம் · வருகை</p>
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
                <dt>வரைபடம்</dt>
                <dd>
                  <a href={contact.mapLink} target="_blank" rel="noreferrer">
                    Google Maps-இல் திறக்க
                  </a>
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
