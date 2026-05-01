export const Logo = () => (
  <div className="flex items-center gap-3 sm:gap-4">
    {/* Mark — rounded square with three white leaves */}
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-primary shadow-glow-soft sm:h-16 sm:w-16">
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 text-white sm:h-10 sm:w-10"
        fill="currentColor"
        aria-hidden
      >
        {/* Center upright leaf */}
        <path d="M32 8c-5 6-8 11-8 17 0 4 2 7 5 9v12a3 3 0 006 0V34c3-2 5-5 5-9 0-6-3-11-8-17z" />
        {/* Left leaf */}
        <path d="M14 26c-4 4-6 9-5 14 1 4 4 6 8 6 3 0 6-2 7-5-3-2-5-5-5-9 0-2 0-4-1-6-1-1-2-1-4 0z" />
        {/* Right leaf */}
        <path d="M50 26c4 4 6 9 5 14-1 4-4 6-8 6-3 0-6-2-7-5 3-2 5-5 5-9 0-2 0-4 1-6 1-1 2-1 4 0z" />
      </svg>
    </div>

    {/* Wordmark */}
    <div className="min-w-0 leading-tight">
      <h2 className="font-display text-2xl font-extrabold tracking-[0.18em] text-foreground sm:text-3xl">
        AMBIENTA
      </h2>
      <p className="mt-0.5 text-[11px] text-primary/90 sm:text-xs">
        Sua TV em qualquer lugar.
      </p>
    </div>
  </div>
);
