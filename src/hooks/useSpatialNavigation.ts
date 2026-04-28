import { useEffect } from "react";

/**
 * Spatial navigation for TV remotes / keyboard arrows.
 * - Arrow keys move focus to the nearest focusable element in that direction
 * - Enter/Space activate
 * - Esc returns focus to the first sidebar item
 * Marks <html> with data-input="key" while keyboard is in use,
 * so we can show a strong focus ring only for remote/keyboard users.
 */

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[role='button']:not([disabled])",
].join(",");

type Dir = "up" | "down" | "left" | "right";

function getFocusables(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => {
      if (el.hasAttribute("disabled")) return false;
      if (el.getAttribute("aria-hidden") === "true") return false;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const style = window.getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") return false;
      // Skip elements inside ui-fade-out container (relax mode)
      if (el.closest(".ui-fade-out")) return false;
      return true;
    }
  );
}

function center(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, rect: r };
}

function findNext(current: HTMLElement, dir: Dir): HTMLElement | null {
  const all = getFocusables().filter((el) => el !== current);
  if (!all.length) return null;
  const c = center(current);

  let best: { el: HTMLElement; score: number } | null = null;

  for (const el of all) {
    const t = center(el);
    const dx = t.x - c.x;
    const dy = t.y - c.y;

    let primary: number; // distance along axis (must be positive in dir)
    let secondary: number; // distance perpendicular

    switch (dir) {
      case "right": primary = dx;  secondary = Math.abs(dy); break;
      case "left":  primary = -dx; secondary = Math.abs(dy); break;
      case "down":  primary = dy;  secondary = Math.abs(dx); break;
      case "up":    primary = -dy; secondary = Math.abs(dx); break;
    }

    if (primary <= 4) continue; // not in that direction
    // Penalize perpendicular distance heavily
    const score = primary + secondary * 2.5;
    if (!best || score < best.score) best = { el, score };
  }

  return best?.el ?? null;
}

export function useSpatialNavigation() {
  useEffect(() => {
    // Focus first interactive element on mount
    requestAnimationFrame(() => {
      const first = getFocusables()[0];
      first?.focus();
    });

    const markKey = () => document.documentElement.setAttribute("data-input", "key");
    const markPointer = () => document.documentElement.setAttribute("data-input", "pointer");
    document.documentElement.setAttribute("data-input", "key");

    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      const isArrow = key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";

      if (isArrow || key === "Enter" || key === " " || key === "Escape" || key === "Tab") {
        markKey();
      }

      // Don't hijack typing inside text inputs
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || active?.isContentEditable) return;

      if (key === "Escape") {
        const first = getFocusables()[0];
        first?.focus();
        e.preventDefault();
        return;
      }

      if (!isArrow) return;

      const current = (active && active !== document.body ? active : getFocusables()[0]) as HTMLElement | null;
      if (!current) return;

      const dir: Dir =
        key === "ArrowUp" ? "up" :
        key === "ArrowDown" ? "down" :
        key === "ArrowLeft" ? "left" : "right";

      const next = findNext(current, dir);
      if (next) {
        next.focus();
        next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", markPointer, { passive: true });
    window.addEventListener("mousedown", markPointer, { passive: true });
    window.addEventListener("touchstart", markPointer, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", markPointer);
      window.removeEventListener("mousedown", markPointer);
      window.removeEventListener("touchstart", markPointer);
    };
  }, []);
}
