import { Link } from "react-router-dom";
import story from "../content/story.json";
import { Reveal } from "../components/Reveal";
import { BookDownload } from "../components/BookDownload";
import "./Pages.css";
import "../components/BookDownload.css";

export function Story() {
  return (
    <>
      <header className="page-banner">
        <div className="section-inner">
          <h1>{story.titleTa}</h1>
          <span className="en-caption">{story.titleEn}</span>
          <p className="lead">{story.subtitleTa}</p>
        </div>
      </header>

      <div className="page-body">
        <div className="page-body-inner">
          <BookDownload book={story.book} />

          <p className="source-note">
            {story.sourceNoteTa}
            <span className="en-caption">{story.sourceNoteEn}</span>
          </p>

          <ol className="chapter-list">
            {story.chapters.map((chapter, index) => (
              <Reveal as="li" key={chapter.id} className="chapter-item">
                <div className="timeline-era">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2>{chapter.titleTa}</h2>
                <span className="en-caption">{chapter.titleEn}</span>
                <p>{chapter.bodyTa}</p>
                <span className="en-caption">{chapter.bodyEn}</span>
              </Reveal>
            ))}
          </ol>

          <div className="related-links">
            <Link className="btn btn-primary" to="/villupaattu">
              வில்லுப்பாட்டு
            </Link>
            <Link className="btn btn-outline" to="/history">
              கோயில் வரலாறு
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
