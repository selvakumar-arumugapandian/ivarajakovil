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
| `temple.json` | Name, place, tagline, contact, hero image path |
| `history.json` | History sections |
| `events.json` | Upcoming / past events |
| `members.json` | Committee members |
| `gallery.json` | Photos and video embed URLs |

Replace `public/images/deity-hero.svg` with your main deity photo (e.g. `deity-hero.jpg`) and update `heroImage` in `temple.json`. Swap gallery SVGs with real photos the same way.
