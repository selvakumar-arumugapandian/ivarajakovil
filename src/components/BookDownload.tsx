import "./BookDownload.css";

type BookInfo = {
  titleTa: string;
  titleEn: string;
  seriesTa?: string;
  file: string;
  downloadLabelTa: string;
  downloadLabelEn: string;
};

export function BookDownload({ book }: { book: BookInfo }) {
  return (
    <aside className="book-download" aria-label="நூல் பதிவிறக்கம்">
      <div className="book-download-text">
        <h2>{book.titleTa}</h2>
        <span className="en-caption">{book.titleEn}</span>
        {book.seriesTa ? <p className="book-series">{book.seriesTa}</p> : null}
        <p className="book-hint">முழுக் கதையும் வில்லுப்பாட்டும் அடங்கிய மூல நூல்</p>
      </div>
      <a
        className="btn btn-primary"
        href={book.file}
        download="ஐவர்_ராசாக்கள்_கதை.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        {book.downloadLabelTa}
        <span className="en-caption" style={{ color: "rgba(255,253,248,0.85)" }}>
          {book.downloadLabelEn}
        </span>
      </a>
    </aside>
  );
}
