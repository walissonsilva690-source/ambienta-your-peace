// Edge function: Read ICY (Shoutcast/Icecast) StreamTitle metadata from a radio stream.
// Returns { title, artist, raw } when available.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function parseStreamTitle(raw: string): { title?: string; artist?: string } {
  // Format: StreamTitle='Artist - Title';StreamUrl='...';
  const match = raw.match(/StreamTitle='([^']*)'/);
  if (!match) return {};
  const value = match[1].trim();
  if (!value) return {};
  const sep = value.indexOf(" - ");
  if (sep > 0) {
    return {
      artist: value.slice(0, sep).trim(),
      title: value.slice(sep + 3).trim(),
    };
  }
  return { title: value };
}

async function fetchIcyMetadata(
  streamUrl: string,
  signal: AbortSignal,
): Promise<{ title?: string; artist?: string; raw?: string } | null> {
  const res = await fetch(streamUrl, {
    headers: {
      "Icy-MetaData": "1",
      "User-Agent": "Ambienta/1.0 (ICY metadata reader)",
    },
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Stream returned ${res.status}`);
  }

  const metaIntHeader = res.headers.get("icy-metaint");
  if (!metaIntHeader) {
    // No inline metadata — try to surface station name via icy-name
    const name = res.headers.get("icy-name") ?? undefined;
    res.body.cancel().catch(() => {});
    return name ? { title: name } : null;
  }

  const metaInt = parseInt(metaIntHeader, 10);
  if (!metaInt || metaInt <= 0) {
    res.body.cancel().catch(() => {});
    return null;
  }

  const reader = res.body.getReader();
  let audioRead = 0;
  const decoder = new TextDecoder("utf-8", { fatal: false });

  try {
    // Read until we have skipped metaInt bytes of audio, then 1 length byte, then metadata
    let phase: "audio" | "lenByte" | "meta" = "audio";
    let metaLen = 0;
    let metaBytes: number[] = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done || !value) break;

      for (let i = 0; i < value.length; i++) {
        const b = value[i];
        if (phase === "audio") {
          audioRead++;
          if (audioRead >= metaInt) {
            phase = "lenByte";
          }
        } else if (phase === "lenByte") {
          metaLen = b * 16;
          if (metaLen === 0) {
            // No metadata in this block — keep reading more audio
            phase = "audio";
            audioRead = 0;
          } else {
            phase = "meta";
            metaBytes = [];
          }
        } else if (phase === "meta") {
          metaBytes.push(b);
          if (metaBytes.length >= metaLen) {
            const raw = decoder
              .decode(new Uint8Array(metaBytes))
              .replace(/\0+$/, "")
              .trim();
            const parsed = parseStreamTitle(raw);
            return { ...parsed, raw };
          }
        }
      }
    }
    return null;
  } finally {
    reader.cancel().catch(() => {});
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const streamUrl = url.searchParams.get("url");

    if (!streamUrl) {
      return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic validation: must be http(s)
    let target: URL;
    try {
      target = new URL(streamUrl);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["http:", "https:"].includes(target.protocol)) {
      return new Response(JSON.stringify({ error: "Unsupported protocol" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 8 second hard timeout — we only need a small slice of audio
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const meta = await fetchIcyMetadata(target.toString(), controller.signal);
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({
          ok: true,
          title: meta?.title ?? null,
          artist: meta?.artist ?? null,
          raw: meta?.raw ?? null,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            // Cache 20s at edge to avoid hammering streams
            "Cache-Control": "public, max-age=20",
          },
        },
      );
    } catch (err) {
      clearTimeout(timeout);
      const message = err instanceof Error ? err.message : "Unknown error";
      return new Response(
        JSON.stringify({ ok: false, error: message }),
        {
          status: 200, // soft error — clients fall back to channel name
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
