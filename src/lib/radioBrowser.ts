/**
 * Radio Browser API client.
 * Public, free, community database of licensed live radio streams.
 * Docs: https://api.radio-browser.info
 *
 * Strategy:
 *  - Try multiple mirrors (de1/de2/at1/nl1/fr1) — if one is down, fall back.
 *  - Always pass `hidebroken=true` and reasonable limits.
 *  - Cache successful mirror in-memory for the session.
 */

export type RBStation = {
  /** Stable UUID across mirrors */
  stationuuid: string;
  name: string;
  country: string;
  state?: string;
  language?: string;
  /** Stream URL (direct, may be HLS / mp3 / aac) */
  url_resolved: string;
  url: string;
  favicon: string;
  tags: string;
  codec: string;
  bitrate: number;
  votes: number;
  homepage?: string;
};

const MIRRORS = [
  "https://de1.api.radio-browser.info",
  "https://de2.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
  "https://fr1.api.radio-browser.info",
];

let preferredMirror: string | null = null;

async function fetchFromMirrors(path: string, signal?: AbortSignal): Promise<RBStation[]> {
  const order = preferredMirror
    ? [preferredMirror, ...MIRRORS.filter((m) => m !== preferredMirror)]
    : [...MIRRORS];

  let lastErr: unknown;
  for (const base of order) {
    try {
      const res = await fetch(`${base}${path}`, {
        signal,
        headers: { "User-Agent": "Ambienta/1.0 (web)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as RBStation[];
      preferredMirror = base;
      return data;
    } catch (err) {
      lastErr = err;
      // try next mirror
    }
  }
  throw lastErr ?? new Error("All Radio Browser mirrors failed");
}

const COMMON_QS = "hidebroken=true&order=votes&reverse=true";

export const radioBrowser = {
  byCountry: (country = "Brazil", limit = 50, signal?: AbortSignal) =>
    fetchFromMirrors(
      `/json/stations/bycountry/${encodeURIComponent(country)}?limit=${limit}&${COMMON_QS}`,
      signal,
    ),
  byTag: (tag: string, limit = 30, signal?: AbortSignal) =>
    fetchFromMirrors(
      `/json/stations/bytag/${encodeURIComponent(tag.toLowerCase())}?limit=${limit}&${COMMON_QS}`,
      signal,
    ),
  byName: (name: string, limit = 20, signal?: AbortSignal) =>
    fetchFromMirrors(
      `/json/stations/byname/${encodeURIComponent(name)}?limit=${limit}&hidebroken=true`,
      signal,
    ),
  topClick: (limit = 100, signal?: AbortSignal) =>
    fetchFromMirrors(`/json/stations/topclick/${limit}?hidebroken=true`, signal),
  topVote: (limit = 100, signal?: AbortSignal) =>
    fetchFromMirrors(`/json/stations/topvote/${limit}?hidebroken=true`, signal),
};

/** Map a Radio Browser station to our internal Radio shape. */
export type LiveRadio = {
  id: string;
  name: string;
  country: string;
  location: string;
  genre: string;
  url: string;
  favicon: string;
  tags: string[];
  bitrate: number;
};

export function toLiveRadio(s: RBStation): LiveRadio {
  const tags = (s.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    id: s.stationuuid,
    name: s.name.trim() || "Sem nome",
    country: s.country || "—",
    location: [s.state, s.country].filter(Boolean).join(" · ") || "—",
    genre: tags[0] || s.codec || "Rádio",
    url: s.url_resolved || s.url,
    favicon: s.favicon,
    tags,
    bitrate: s.bitrate || 0,
  };
}
