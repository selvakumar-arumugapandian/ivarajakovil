import temple from "../content/temple.json";
import { Reveal } from "../components/Reveal";
import "./Pages.css";

export function Contact() {
  const { contact } = temple;

  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>தொடர்பு</h1>
          <p className="lead">{temple.placeTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner contact-grid">
          <Reveal>
            <dl className="contact-details">
              <dt>முகவரி</dt>
              <dd>{contact.addressTa}</dd>

              <dt>தொலைபேசி</dt>
              <dd>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
              </dd>

              <dt>மின்னஞ்சல்</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>

              <dt>வரைபடம்</dt>
              <dd>
                <a href={contact.mapLink} target="_blank" rel="noreferrer">
                  வரைபடத்தில் திறக்க
                </a>
              </dd>
            </dl>
          </Reveal>

          <Reveal>
            <iframe
              className="map-embed"
              title="திப்பனம்பட்டி வரைபடம்"
              src={contact.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </>
  );
}
