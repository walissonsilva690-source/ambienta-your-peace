/**
 * Client for the icy-metadata edge function.
 * Reads StreamTitle (Shoutcast/Icecast) for the current radio stream.
 */
import { supabase } from "@/integrations/supabase/client";

export interface IcyMetadata {
  title: string | null;
  artist: string | null;
  raw: string | null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export async function fetchIcyMetadata(
  streamUrl: string,
  signal?: AbortSignal,
): Promise<IcyMetadata | null> {
  if (!streamUrl) return null;
  try {
    const url =
      `${SUPABASE_URL}/functions/v1/icy-metadata?url=` +
      encodeURIComponent(streamUrl);
    const res = await fetch(url, {
      signal,
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ok) return null;
    return {
      title: data.title ?? null,
      artist: data.artist ?? null,
      raw: data.raw ?? null,
    };
  } catch {
    return null;
  }
}

// Suppress unused import warning — supabase client kept for future typed RPCs
void supabase;
