import { Link } from "react-router-dom";
import temple from "../content/temple.json";
import { VisitorCount } from "./VisitorCount";
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
          <div>
            <a href={temple.contact.mapLink} target="_blank" rel="noreferrer">
              வரைபடத்தில் காண்க
            </a>
          </div>
          <div>
            <Link to="/contact">தொடர்பு</Link>
          </div>
          <VisitorCount />
        </div>

        <div className="footer-bottom">
          <div>© {year} {temple.nameTa}</div>
          <div className="footer-credit">
            Website design by{" "}
            <a
              href="https://www.pranaveshintelligence.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pranavesh Intelligence Solutions Private Limited
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
