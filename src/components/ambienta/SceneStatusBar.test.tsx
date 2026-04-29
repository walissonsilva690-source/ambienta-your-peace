import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { SceneStatusBar } from "./SceneStatusBar";
import { useSceneStatus } from "@/contexts/SceneStatusContext";

// Mock the context so we can drive phase transitions deterministically.
vi.mock("@/contexts/SceneStatusContext", () => {
  return {
    useSceneStatus: vi.fn(),
  };
});

const mockedUseSceneStatus = vi.mocked(useSceneStatus);

const setStatus = (loaded: boolean, failed: boolean) => {
  mockedUseSceneStatus.mockReturnValue({
    loaded,
    failed,
    markLoaded: () => {},
    markFailed: () => {},
  });
};

const liveRegion = () =>
  document.querySelector('[role="status"][aria-live="polite"]') as HTMLElement;

const flushAnnouncement = async () => {
  // Component schedules the message via setTimeout(50) after toggling to "".
  await act(async () => {
    vi.advanceTimersByTime(60);
  });
};

describe("SceneStatusBar aria-live announcements", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("announces the initial loading phase", async () => {
    setStatus(false, false);
    render(<SceneStatusBar />);
    await flushAnnouncement();
    expect(liveRegion().textContent).toBe("Carregando ambiente");
  });

  it("announces a real loading → loaded transition only once", async () => {
    setStatus(false, false);
    const { rerender } = render(<SceneStatusBar />);
    await flushAnnouncement();
    expect(liveRegion().textContent).toBe("Carregando ambiente");

    // Re-render with the SAME phase — must NOT re-announce.
    setStatus(false, false);
    rerender(<SceneStatusBar />);
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(liveRegion().textContent).toBe("Carregando ambiente");

    // Real transition → loaded.
    setStatus(true, false);
    rerender(<SceneStatusBar />);
    // Briefly cleared, then set.
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    expect(liveRegion().textContent).toBe("");
    await flushAnnouncement();
    expect(liveRegion().textContent).toBe("Ambiente pronto");
  });

  it("announces a failed transition with a descriptive message", async () => {
    setStatus(false, false);
    const { rerender } = render(<SceneStatusBar />);
    await flushAnnouncement();

    setStatus(false, true);
    rerender(<SceneStatusBar />);
    await flushAnnouncement();

    expect(liveRegion().textContent).toBe(
      "Falha no carregamento do ambiente. Usando fundo estático."
    );
  });

  it("does not re-announce on identical re-renders of the same phase", async () => {
    setStatus(true, false);
    const { rerender } = render(<SceneStatusBar />);
    await flushAnnouncement();
    expect(liveRegion().textContent).toBe("Ambiente pronto");

    // Several no-op rerenders.
    for (let i = 0; i < 3; i++) {
      setStatus(true, false);
      rerender(<SceneStatusBar />);
    }
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    // Still the same — never cleared back to "" by a phantom transition.
    expect(liveRegion().textContent).toBe("Ambiente pronto");
  });

  it("keeps the visual pill out of focus / spatial navigation", () => {
    setStatus(false, false);
    render(<SceneStatusBar />);

    const pill = screen.getByText("Carregando ambiente...").closest("div")
      ?.parentElement as HTMLElement;
    expect(pill).toBeTruthy();
    expect(pill.getAttribute("aria-hidden")).toBe("true");
    expect(pill.getAttribute("tabindex")).toBe("-1");
    expect(pill.hasAttribute("inert")).toBe(true);
  });
});
