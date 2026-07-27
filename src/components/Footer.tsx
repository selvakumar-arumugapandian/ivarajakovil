import { Link } from "react-router-dom";
import temple from "../content/temple.json";
import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2>{temple.nameTa}</h2>
          <p className="footer-place">{temple.placeTa}</p>
        </div>

        <div className="footer-meta">
          <div>{temple.contact.addressTa}</div>
          <div>
            <a href={`tel:${temple.contact.phone.replace(/\s/g, "")}`}>
              {temple.contact.phone}
            </a>
            <br />
            <a href={`mailto:${temple.contact.email}`}>{temple.contact.email}</a>
          </div>
          <div>
            <a href={temple.contact.mapLink} target="_blank" rel="noreferrer">
              வரைபடத்தில் காண்க
            </a>
          </div>
          <div>
            <Link to="/contact">தொடர்பு</Link>
          </div>
        </div>

        <div className="footer-bottom">
          © {year} {temple.nameTa}
        </div>
      </div>
    </footer>
  );
}
