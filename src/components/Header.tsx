import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import temple from "../content/temple.json";
import "./Header.css";

const links = [
  { to: "/", label: "முகப்பு", title: "Home", end: true },
  { to: "/history", label: "வரலாறு", title: "History" },
  { to: "/events", label: "நிகழ்வுகள்", title: "Events" },
  { to: "/gallery", label: "புகைப்படங்கள்", title: "Gallery" },
  { to: "/contact", label: "தொடர்பு", title: "Contact" },
] as const;

export function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const headerClass = [
    "site-header",
    isHome ? (scrolled ? "is-solid" : "is-transparent") : "is-inner",
  ].join(" ");

  return (
    <header className={headerClass}>
      <div className="nav-inner">
        <NavLink
          to="/"
          className="brand-link"
          title={`${temple.nameTa} — ${temple.nameEn}`}
          aria-label={temple.nameTa}
        >
          <span className="brand-ta">ஐவராஜா திருக்கோயில்</span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        <nav id="site-nav" aria-label="முதன்மை வழிசெலுத்தல்">
          <ul className={`nav-list${open ? " is-open" : ""}`}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={"end" in link ? link.end : false}
                  title={link.title}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
