"""Extract villupaattu seiyyul from the book PDF into villupaattu.json.

Cleans OCR noise: margin line-numbers, footnote blurbs, and broken
word wraps that left single letters/words on their own lines.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
PDF_CANDIDATES = list((ROOT / "src" / "assets").glob("TVA_BOK*.pdf"))
PDF = PDF_CANDIDATES[0] if PDF_CANDIDATES else ROOT / "public" / "books" / "aivar-rasakkal-kathai.pdf"

ZW = dict.fromkeys(map(ord, "\u200c\u200d\ufeff"), None)

START_PAGE = 50
END_PAGE = 218
PAGES_PER_PART = 5
TARGET_LINE_LEN = 48

METER_MARKERS = {
    "வேறு",
    "(வேறு)",
    "அடி வேறு",
    "விருத்தம்",
    "சீர்சிந்து",
    "சர்சிந்து",
    "இர் சிந்து",
    "ழ் இந்து",
    "நான்கு சீர்சிந்து",
    "மூன்று சர் சிந்து",
}

EDITORIAL_RE = re.compile(
    r"(கூறுகிறான்|கூறுகிறது|கூறப்படுக|கூறப்பட்ட|சொல்லப்பட்டிரு|"
    r"சொல்லப்படு|குறிப்பிடப்பட்டு|பா\.?\s*வ\.|பேச்சு வழக்கு|"
    r"நெல்லைப்?\s*பேச்சு|நாஞ்சில்|இப்பெயர்|தெரியவில்லை|"
    r"முடிய வரை|முதல்\s+\d|வது அடி|இடம்\s*$|போரில் இறந்து|"
    r"வைத்திருந்த பொக்கிஷம்|குடும்பப்\s*பெண்கள்)",
    re.UNICODE,
)

LEADING_NUM_RE = re.compile(
    r"^(?:"
    r"\d{2,5}(?:\s*[-–—,.]\s*\d{2,5})?"  # 5080 or 4999-5005
    r"|"
    r"\(\d{2,5}"  # (430
    r")"
    r"\s*[-–—.:)]*\s*"
)

LATIN_JUNK_RE = re.compile(r"[A-Za-z]{3,}")
ONLY_PUNCT_RE = re.compile(r"^[\d\s.,:;|/\\\-–—'\"`~_+*=()\[\]{}|]+$")
LATIN_TOKEN_RE = re.compile(r"\b[A-Za-z]{2,}\b")
STRAY_PUNCT_RE = re.compile(r"(?:^|\s)[நனமவயரலச]\s*[;:](?:\s|$)")


def scrub_inline(s: str) -> str:
    s = LATIN_TOKEN_RE.sub(" ", s)
    s = STRAY_PUNCT_RE.sub(" ", s)
    s = re.sub(r"[|_]{2,}", " ", s)
    s = re.sub(r"\s{2,}", " ", s)
    return s.strip(" -–—_|")


def near_duplicate(a: str, b: str) -> bool:
    """Catch OCR repeats like முகந்தடவி / மூகந்தடவி."""
    if not a or not b:
        return False
    aa = re.sub(r"\s+", "", a)
    bb = re.sub(r"\s+", "", b)
    if aa == bb:
        return True
    if abs(len(aa) - len(bb)) > 4:
        return False
    # shared prefix of most of the shorter string
    n = min(len(aa), len(bb))
    same = sum(1 for i in range(n) if aa[i] == bb[i])
    return same / max(n, 1) >= 0.82


def finalize_lines(lines: list[str]) -> list[str]:
    cleaned: list[str] = []
    for ln in lines:
        s = scrub_inline(strip_leading_numbers(ln))
        s = s.lstrip("_").strip()
        if is_noise(s) or is_editorial(s):
            continue
        if cleaned and near_duplicate(cleaned[-1], s):
            # keep the longer / cleaner variant
            if tamil_len(s) > tamil_len(cleaned[-1]):
                cleaned[-1] = s
            continue
        cleaned.append(s)
    return wrap_poetic(rejoin_lines(cleaned)) if cleaned else []


def tamil_len(s: str) -> int:
    return sum(1 for ch in s if "\u0b80" <= ch <= "\u0bff")


def is_tamil_char(ch: str) -> bool:
    return "\u0b80" <= ch <= "\u0bff"


def clean_raw(t: str) -> str:
    t = (t or "").translate(ZW).replace("\xa0", " ")
    t = unicodedata.normalize("NFC", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r" *\n *", "\n", t)
    return t.strip()


def strip_leading_numbers(s: str) -> str:
    prev = None
    while prev != s:
        prev = s
        s = LEADING_NUM_RE.sub("", s).strip()
    # trailing isolated numbers left from OCR
    s = re.sub(r"\s+\d{2,5}(?:\s*[-–—]\s*\d{2,5})?\s*$", "", s).strip()
    return s


def is_meter_line(s: str) -> bool:
    core = s.strip(" .-–—()[]")
    if core in METER_MARKERS:
        return True
    if s in METER_MARKERS:
        return True
    if re.fullmatch(r"[\(\[]?வேறு[\)\]]?", s.strip()):
        return True
    if "விருத்தம்" in s and tamil_len(s) <= 12:
        return True
    if "சிந்து" in s and tamil_len(s) <= 18:
        return True
    return False


def is_editorial(s: str) -> bool:
    if EDITORIAL_RE.search(s):
        return True
    # Footnote-ish: starts as numbered gloss then prose
    if re.match(r"^\d{3,5}\b", s) and tamil_len(s) > 20:
        return True
    # Mostly Latin OCR garbage
    if LATIN_JUNK_RE.search(s) and tamil_len(s) < 12:
        return True
    # Incomplete footnote caption leftovers (name + இடம் / அதிகாரி,)
    if re.search(r"[ிீ]டம்\s*$", s) and tamil_len(s) < 45:
        return True
    if re.search(r"அதிகாரி\s*,?\s*$", s) and tamil_len(s) < 45:
        return True
    return False


def merge_echo_start(prev: str, nxt: str) -> str | None:
    """If next line echoes the end of previous (OCR stutter), merge once."""
    pw = prev.split()
    nw = nxt.split()
    if not pw or not nw:
        return None
    end = pw[-1].strip("'\"“”")
    start = nw[0].strip("'\"“”")
    if near_duplicate(end, start) and tamil_len(end) >= 4:
        return prev + " " + " ".join(nw[1:])
    return None


def is_noise(s: str) -> bool:
    s = s.strip()
    if not s:
        return True
    if ONLY_PUNCT_RE.fullmatch(s):
        return True
    if tamil_len(s) == 0:
        return True
    if tamil_len(s) <= 1 and len(s) <= 3:
        return True
    return False


def looks_like_word_break(prev: str, nxt: str) -> bool:
    """True when OCR wrapped mid-word (அதிகாரி + களும்)."""
    if not prev or not nxt:
        return False
    a = prev[-1]
    b = nxt[0]
    if not (is_tamil_char(a) and is_tamil_char(b)):
        return False
    # next is a short continuation fragment
    if tamil_len(nxt) <= 10 and " " not in nxt.strip():
        return True
    # previous ends mid-token (no trailing punctuation / space sense)
    if prev[-1] not in ".,;:!?)”'\"…" and tamil_len(prev) < 28:
        if tamil_len(nxt) < 16:
            return True
    return False


def should_join(prev: str, nxt: str) -> bool:
    if is_meter_line(prev) or is_meter_line(nxt):
        return False
    if prev.endswith((".", "!", "?", "…", "”", "’")):
        return False
    # Always join tiny / short continuation fragments onto previous line
    if tamil_len(nxt) <= 16 or tamil_len(prev) <= 18:
        return True
    if looks_like_word_break(prev, nxt):
        return True
    # Soft-wrap: both medium-short poetic scraps
    if tamil_len(prev) < 36 and tamil_len(nxt) < 36:
        return True
    return False


def join_fragment(prev: str, nxt: str) -> str:
    if looks_like_word_break(prev, nxt):
        return prev.rstrip("-–— ") + nxt.lstrip("-–— ")
    return f"{prev.rstrip()} {nxt.lstrip()}"


def rejoin_lines(lines: list[str]) -> list[str]:
    out: list[str] = []
    buf = ""
    for raw in lines:
        s = strip_leading_numbers(raw.strip(" |"))
        s = re.sub(r"\s{2,}", " ", s).strip(" -–—")
        if is_noise(s) or is_editorial(s):
            continue
        if is_meter_line(s):
            if buf:
                out.append(buf)
                buf = ""
            out.append(s if s.startswith("(") else s)
            continue
        if not buf:
            buf = s
            continue
        if should_join(buf, s):
            echoed = merge_echo_start(buf, s)
            buf = echoed if echoed is not None else join_fragment(buf, s)
        else:
            echoed = merge_echo_start(buf, s)
            if echoed is not None:
                buf = echoed
            else:
                out.append(buf)
                buf = s
    if buf:
        out.append(buf)
    return out


def wrap_poetic(lines: list[str]) -> list[str]:
    """Re-wrap long joined lines onto readable verse-ish widths."""
    wrapped: list[str] = []
    for line in lines:
        if is_meter_line(line) or tamil_len(line) <= TARGET_LINE_LEN + 8:
            wrapped.append(line)
            continue
        words = line.split()
        cur = ""
        for w in words:
            trial = w if not cur else f"{cur} {w}"
            if tamil_len(trial) <= TARGET_LINE_LEN:
                cur = trial
            else:
                if cur:
                    wrapped.append(cur)
                cur = w
        if cur:
            wrapped.append(cur)
    return wrapped


def extract_page_lines(page: fitz.Page) -> list[str]:
    """Use plain text extraction (fast on large scanned PDFs)."""
    return [ln for ln in clean_raw(page.get_text("text") or "").splitlines() if ln.strip()]


def extract_pages(doc: fitz.Document) -> list[dict]:
    pages: list[dict] = []
    for i in range(START_PAGE - 1, END_PAGE):
        raw_lines = extract_page_lines(doc.load_page(i))
        cleaned = finalize_lines(raw_lines)
        cleaned = [ln for ln in cleaned if is_meter_line(ln) or tamil_len(ln) >= 4]
        if cleaned:
            pages.append({"pdfPage": i + 1, "lines": cleaned})
    return pages


def build_parts(pages: list[dict]) -> list[dict]:
    parts: list[dict] = []
    for idx in range(0, len(pages), PAGES_PER_PART):
        chunk = pages[idx : idx + PAGES_PER_PART]
        body_lines: list[str] = []
        for pg in chunk:
            body_lines.extend(pg["lines"])
            body_lines.append("")
        while body_lines and not body_lines[-1]:
            body_lines.pop()
        # collapse multiple blanks
        compact: list[str] = []
        blank = False
        for ln in body_lines:
            if not ln:
                if not blank and compact:
                    compact.append("")
                    blank = True
                continue
            compact.append(ln)
            blank = False
        body = "\n".join(compact).strip()
        if tamil_len(body) < 40:
            continue
        title_src = next(
            (ln for ln in compact if ln and not is_meter_line(ln) and tamil_len(ln) >= 10),
            f"செய்யுள் {len(parts) + 1}",
        )
        snippet = title_src[:40].rstrip(" ,.-")
        if len(title_src) > 40:
            snippet += "…"
        pno = len(parts) + 1
        parts.append(
            {
                "id": f"seiyyul-{pno:02d}",
                "titleTa": f"செய்யுள் {pno:02d}",
                "bodyTa": body,
                "sourcePages": f"{chunk[0]['pdfPage']}–{chunk[-1]['pdfPage']}",
                "preview": snippet,
            }
        )
    return parts


def main() -> None:
    doc = fitz.open(str(PDF))
    pages = extract_pages(doc)
    parts = build_parts(pages)

    # Spot-check the previously broken region (old part 40 area ~ pages 205-215)
    sample_pages = [p for p in pages if 205 <= p["pdfPage"] <= 212]
    sample_text = "\n".join(ln for p in sample_pages for ln in p["lines"][:8])

    out = {
        "titleTa": "வில்லுப்பாட்டு",
        "subtitleTa": "ஐவர் ராசாக்கள் கதை — நூல் மூலச் செய்யுள்",
        "introTa": (
            "நூலின் வில்லுப்பாட்டு மூலச் செய்யுள் இங்கே பக்கங்களாகப் பிரிக்கப்பட்டுள்ளது. "
            "பழைய அச்சு நூலின் எழுத்துணரியால் சில இடங்களில் எழுத்துப் பிழைகள் இருக்கலாம்; "
            "முழுத் துல்லியத்திற்கு PDF நூலைப் பதிவிறக்கிப் படிக்கவும்."
        ),
        "sourceNoteTa": (
            "மூலம்: நாட்டுப்பாடல் வெளியீடு — ஐவர் ராசாக்கள் கதை (வில்லுப்பாட்டு). "
            "வழங்குமிடம்: நெல்லை தென்பகுதி / குமரிமாவட்டம் வடபகுதி."
        ),
        "book": {
            "titleTa": "ஐவர் ராசாக்கள் கதை",
            "seriesTa": "நாட்டுப்பாடல் வெளியீடு",
            "file": "/books/aivar-rasakkal-kathai.pdf",
            "downloadLabelTa": "முழு நூலைப் பதிவிறக்குக",
        },
        "parts": [{"id": p["id"], "titleTa": p["titleTa"], "bodyTa": p["bodyTa"]} for p in parts],
        "performanceNoteTa": (
            "இச் செய்யுள் குமரி–நெல்லைப் பகுதிகளில் வில்லுப்பாட்டாகப் பாடப்பட்ட மரபின் மூலம். "
            "ஏட்டுப் பிரதிகளை ஒப்பிட்டு அச்சிடப்பட்ட நூலின் மூலப் பகுதியிலிருந்து எடுக்கப்பட்டது."
        ),
    }

    target = ROOT / "src" / "content" / "villupaattu.json"
    target.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    meta = {
        "parts": len(parts),
        "chars": sum(len(p["bodyTa"]) for p in parts),
        "sample_near_old_issue": sample_text[:800],
        "has_leading_5080": any("5080" in p["bodyTa"] for p in parts),
        "has_koodukiran_note": any("கூறுகிறான்" in p["bodyTa"] for p in parts),
    }
    (ROOT / "tmp-villu-clean-meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(
        json.dumps(
            {
                "parts": meta["parts"],
                "chars": meta["chars"],
                "has_leading_5080": meta["has_leading_5080"],
                "has_koodukiran_note": meta["has_koodukiran_note"],
            }
        )
    )


if __name__ == "__main__":
    main()
