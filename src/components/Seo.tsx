import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import temple from "../content/temple.json";

type RouteSeo = {
  title: string;
  description: string;
};

const site = temple.siteUrl.replace(/\/$/, "");
const baseTitle = temple.seo.titleEn;
const baseDescription = temple.seo.descriptionEn;

const ROUTES: Record<string, RouteSeo> = {
  "/": {
    title: baseTitle,
    description: baseDescription,
  },
  "/varalaru": {
    title: `வரலாறு | Aivar Rasakkal History | ${temple.nameTa}`,
    description:
      "ஐவர் ராசாக்கள் வரலாறு — read the temple origin story of Arulmigu Sri Ivaraja Thirukovil.",
  },
  "/villupaattu": {
    title: `வில்லுப்பாட்டு | Villupaattu | ${temple.nameTa}`,
    description:
      "ஐவர் ராசாக்கள் வில்லுப்பாட்டு மூலச் செய்யுள் — traditional ballad verses of Ivaraja Temple.",
  },
  "/events": {
    title: `நிகழ்வுகள் | Kadaisi Velli & Festivals | Ivaraja Temple`,
    description:
      "கடைசி வெள்ளி பூஜை dates and திருவிழா நினைவுகள் for Ivaraja Temple, Thippanampatti.",
  },
  "/gallery": {
    title: `புகைப்படங்கள் | Darshan Gallery | Ivaraja Temple`,
    description:
      "Temple darshan photos and media from Arulmigu Sri Ivaraja Thirukovil.",
  },
  "/contact": {
    title: `தொடர்பு | Contact & Map | Ivaraja Temple Thippanampatti`,
    description:
      "Visit Arulmigu Sri Ivaraja Temple at Saluvan Murugavelpatti, Thippanampatti, Pavoorchatram, Tenkasi. Map pin and directions.",
  },
};

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${name}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function Seo() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "") || "/";
  const seo = ROUTES[path] ?? {
    title: baseTitle,
    description: baseDescription,
  };
  const url = `${site}${path === "/" ? "/" : path}`;

  useEffect(() => {
    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("og:title", seo.title, true);
    setMeta("og:description", seo.description, true);
    setMeta("og:url", url, true);
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [seo.description, seo.title, url]);

  return null;
}
