export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-glow-soft">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary-foreground" fill="currentColor" aria-hidden>
        <path d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z" opacity=".95"/>
        <path d="M12 22c-2-3-4-6-4-9 0 0 2 2 4 2s4-2 4-2c0 3-2 6-4 9z" opacity=".7"/>
      </svg>
    </div>
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">AMBIENTA</h2>
      <p className="text-xs text-primary/90">Sua TV em qualquer lugar.</p>
    </div>
  </div>
);
