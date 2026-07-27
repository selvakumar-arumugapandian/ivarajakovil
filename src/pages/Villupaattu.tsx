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
          <span className="en-caption">{villu.titleEn}</span>
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
              <span className="en-caption">{villu.introEn}</span>
            </div>
          </Reveal>

          <p className="source-note">
            {villu.sourceNoteTa}
            <span className="en-caption">{villu.sourceNoteEn}</span>
          </p>

          <ol className="part-list">
            {villu.parts.map((part, index) => (
              <Reveal as="li" key={part.id} className="part-item">
                <div className="timeline-era">
                  பாடல் {String(index + 1).padStart(2, "0")}
                </div>
                <h2>{part.titleTa}</h2>
                <span className="en-caption">{part.titleEn}</span>
                <p>{part.bodyTa}</p>
                <span className="en-caption">{part.bodyEn}</span>
              </Reveal>
            ))}
          </ol>

          <p className="source-note" style={{ marginTop: "2rem" }}>
            {villu.performanceNoteTa}
            <span className="en-caption">{villu.performanceNoteEn}</span>
          </p>

          <div className="related-links">
            <Link className="btn btn-primary" to="/story">
              கதைச் சுருக்கம்
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
