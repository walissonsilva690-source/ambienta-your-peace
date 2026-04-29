export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow-soft">
      {/* Three-leaf mark — matches Ambienta brand reference */}
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-primary-foreground" fill="currentColor" aria-hidden>
        <path d="M16 3c-4 4-7 7-7 11a4 4 0 003 3.9V25a1 1 0 002 0v-7.1A4 4 0 0017 14c0-4-1-7-1-11z" opacity=".95" />
        <path d="M7 11c-3 2-5 5-5 9 0 3 2 5 5 5 2 0 4-1 5-3-2-1-3-3-3-5 0-2 0-4-2-6z" opacity=".8" />
        <path d="M25 11c3 2 5 5 5 9 0 3-2 5-5 5-2 0-4-1-5-3 2-1 3-3 3-5 0-2 0-4 2-6z" opacity=".8" />
      </svg>
    </div>
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">AMBIENTA</h2>
      <p className="text-xs text-primary/90">Sua TV em qualquer lugar.</p>
    </div>
  </div>
);
