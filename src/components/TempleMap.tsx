import { useEffect, useState } from "react";
import temple from "../content/temple.json";

/**
 * Google Maps embed with exact pin. Shows a local preview shell first so the
 * page feels instant while the iframe finishes loading.
 */
export function TempleMap() {
  const { contact } = temple;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const origins = [
      "https://maps.google.com",
      "https://www.google.com",
      "https://maps.gstatic.com",
      "https://maps.googleapis.com",
    ];
    const links = origins.map((href) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      return link;
    });
    return () => {
      for (const link of links) link.remove();
    };
  }, []);

  return (
    <div className={`temple-map${ready ? " is-ready" : ""}`}>
      <div className="temple-map-shell" aria-hidden={ready}>
        <div className="temple-map-pin" />
        <p>வரைபடம் ஏற்றப்படுகிறது…</p>
        <a href={contact.mapLink} target="_blank" rel="noreferrer">
          Google Maps-இல் திறக்க
        </a>
      </div>

      <iframe
        className="map-embed"
        title="அருள்மிகு ஸ்ரீ ஐவராஜா திருக்கோயில் வரைபடம்"
        src={contact.mapEmbedUrl}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onLoad={() => setReady(true)}
      />
    </div>
  );
}
