"""Format the site's Scholar snapshot as GB/T 7714-2025 CV references.

The source citation is intentionally kept unchanged in data.js.  The formatter
only uses metadata present in that record and never invents a volume or page.
Editors can override an incomplete automatically generated entry in the local
manager's GB/T citation field after checking the publisher or preprint page.
"""

from __future__ import annotations

import re
from datetime import date


def authors(text: str) -> str:
    names = [part.strip().strip(". ") for part in re.split(r"[,，]", text) if part.strip(". ")]
    names = [name for name in names if name not in ("...", "…")]
    chinese = any(re.search(r"[\u4e00-\u9fff]", name) for name in names[:3])
    rendered = []
    for name in names[:3]:
        if re.search(r"[\u4e00-\u9fff]", name):
            rendered.append(name)
        else:
            parts = name.split()
            rendered.append(f"{parts[-1].upper()} {' '.join(parts[:-1]).replace('.', '').upper()}" if len(parts) > 1 else name.upper())
    separator = "，" if chinese else ", "
    result = separator.join(rendered)
    if len(names) > 3 or "..." in text or "…" in text:
        result += separator + ("等" if chinese else "et al")
    return result


def _clean_venue(text: str, year: int | None) -> str:
    text = text.replace("\u00a0", " ").strip().rstrip(". ")
    if year:
        text = re.sub(rf",\s*{year}$", "", text).strip()
    return text


def _conference(venue: str, year: int | None) -> str:
    clean = re.sub(r"\s*….*$", "", venue).strip().rstrip("(, ")
    if re.search(r"\([A-Za-z0-9-]+$", clean):
        clean += ")"
    if year:
        match = re.search(r",\s*(\d+\s*[-–]\s*\d+)\s*$", clean)
        pages = match.group(1).replace("–", "-") if match else ""
        if match:
            clean = clean[:match.start()].strip()
        return f"[C]//{clean}. {year}" + (f": {pages}." if pages else ".")
    return f"[C]//{clean}."


def _journal(venue: str, year: int | None) -> str:
    venue = re.sub(r"\s*….*$", "", venue).strip().rstrip("(, ")
    volume = issue = pages = ""
    match = re.fullmatch(r"(.+?)\s+(\d+)\s*\(([^)]+)\)(?:,\s*(.*))?", venue)
    if match:
        venue, volume, issue, pages = match.group(1), match.group(2), match.group(3), match.group(4) or ""
    else:
        match = re.fullmatch(r"(.+?)\s+(\d+)(?:,\s*(.*))?", venue)
        if match and not match.group(1).endswith(","):
            venue, volume, pages = match.group(1), match.group(2), match.group(3) or ""
        elif ", " in venue:
            venue, pages = venue.rsplit(", ", 1)
    pages = pages.strip().replace("–", "-")
    if pages.endswith("…"):
        pages = ""
    detail = f", {year}" if year else ""
    if volume:
        detail += f", {volume}"
    if issue:
        detail += f"({issue})"
    if pages:
        detail += f": {pages}"
    return f"[J]. {venue}{detail}."


def format_gbt(publication: dict, accessed: str | None = None) -> str:
    """Return a numbered-list-ready reference, without its [n] prefix."""
    title = str(publication["title"]).strip().rstrip(". ")
    raw = str(publication["citation"]).strip()
    author_text, separator, venue = raw.partition(". ")
    if not separator:
        raise ValueError(f"Citation has no author/source separator: {title}")
    author_line = authors(author_text)
    year = publication.get("year")
    venue = _clean_venue(venue, year)
    accessed = accessed or date.today().isoformat()

    arxiv = re.search(r"arxiv(?:\s*[:. ]\s*|\.\s*org/abs/)(\d{4}\.\d{4,5})", venue, re.I)
    ssrn = re.search(r"SSRN\s+(\d+)", venue, re.I)
    if arxiv:
        title = re.sub(r",\s*\d{4}$", "", title)
        identifier = arxiv.group(1)
        created = f"20{identifier[:2]}-{identifier[2:4]}"
        source = f"[PP/OL]. arXiv ({created})[{accessed}]. https://arxiv.org/abs/{identifier}."
    elif ssrn:
        identifier = ssrn.group(1)
        source = f"[PP/OL]. SSRN[{accessed}]. https://papers.ssrn.com/sol3/papers.cfm?abstract_id={identifier}."
    elif "Conference" in venue and not venue.startswith("Proceedings of the AAAI Conference"):
        source = _conference(venue, year)
    elif venue.startswith("收藏 "):
        source = f"[Z]. {year}." if year else "[Z]."
    else:
        source = _journal(venue, year)
    return f"{author_line}. {title}{source}"
