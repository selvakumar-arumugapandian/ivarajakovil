import "./BookDownload.css";

type BookInfo = {
  titleTa: string;
  seriesTa?: string;
  file: string;
  downloadLabelTa: string;
};

export function BookDownload({ book }: { book: BookInfo }) {
  return (
    <aside className="book-download" aria-label="நூல் பதிவிறக்கம்">
      <div className="book-download-text">
        <h2>{book.titleTa}</h2>
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
      </a>
    </aside>
  );
}
