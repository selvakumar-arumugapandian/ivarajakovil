import { Link } from "react-router-dom";
import history from "../content/history.json";
import story from "../content/story.json";
import { Reveal } from "../components/Reveal";
import { BookDownload } from "../components/BookDownload";
import "./Pages.css";
import "../components/BookDownload.css";

export function History() {
  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{history.titleTa}</h1>
          <span className="en-caption">{history.titleEn}</span>
          <p className="lead">{history.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <BookDownload book={story.book} />

          <ol className="timeline">
            {history.sections.map((section) => (
              <Reveal as="li" key={section.id} className="timeline-item">
                <div className="timeline-era">
                  {section.eraTa}
                  <span className="en-caption">{section.eraEn}</span>
                </div>
                <h2>{section.titleTa}</h2>
                <span className="en-caption">{section.titleEn}</span>
                <p>{section.bodyTa}</p>
                <span className="en-caption">{section.bodyEn}</span>
              </Reveal>
            ))}
          </ol>

          <div className="related-links">
            <Link className="btn btn-primary" to="/story">
              கதைப் பக்கம்
            </Link>
            <Link className="btn btn-outline" to="/villupaattu">
              வில்லுப்பாட்டு
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
