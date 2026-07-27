import { Link } from "react-router-dom";
import villu from "../content/villupaattu.json";
import { Reveal } from "../components/Reveal";
import { BookDownload } from "../components/BookDownload";
import "./Pages.css";
import "../components/BookDownload.css";

export function Villupaattu() {
  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{villu.titleTa}</h1>
          <p className="lead">{villu.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <BookDownload book={villu.book} />

          <Reveal>
            <div className="section-head" style={{ marginBottom: "1.5rem" }}>
              <p className="lead" style={{ color: "var(--ink-muted)" }}>
                {villu.introTa}
              </p>
            </div>
          </Reveal>

          <p className="source-note">{villu.sourceNoteTa}</p>

          <ol className="part-list">
            {villu.parts.map((part, index) => (
              <Reveal as="li" key={part.id} className="part-item">
                <div className="timeline-era">
                  பாடல் {String(index + 1).padStart(2, "0")}
                </div>
                <h2>{part.titleTa}</h2>
                <p>{part.bodyTa}</p>
              </Reveal>
            ))}
          </ol>

          <p className="source-note" style={{ marginTop: "2rem" }}>
            {villu.performanceNoteTa}
          </p>

          <div className="related-links">
            <Link className="btn btn-primary" to="/story">
              கதைப் புத்தகம்
            </Link>
            <a className="btn btn-outline" href={villu.book.file} download="ஐவர்_ராசாக்கள்_கதை.pdf">
              PDF நூல்
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
