# அருள்மிகு ஸ்ரீ ஐவராஜா திருக்கோயில்

Static website for **Arulmigu Shree Ivaraja Thirukovil**, Thippanampatti Village, Pavoorchatram, Tenkasi.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` (Azure Static Web Apps `output_location`).

## Content

Edit JSON under `src/content/`:

| File | Purpose |
|------|---------|
| `temple.json` | Name, place, tagline, contact, home pathways, hero image |
| `story.json` | ஐவர் ராசாக்கள் வரலாறு chapters (`/varalaru`) |
| `villupaattu.json` | வில்லுப்பாட்டு seiyyul parts |
| `events.json` | Festival chronicles + listed events |
| `gallery.json` | Photos and video embed URLs |

Book PDF: `public/books/aivar-rasakkal-kathai.pdf` (ஐவர் ராசாக்கள் கதை).

Optional helper: `scripts/extract_villupaattu_seiyyul.py` regenerates `villupaattu.json` from the book PDF.
