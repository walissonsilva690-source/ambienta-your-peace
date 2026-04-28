/** Discreet bottom-left song info shown in "info" mode. */
export const MinimalInfo = () => {
  return (
    <div className="fixed bottom-10 left-10 z-20 max-w-md animate-fade-in">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tocando agora</p>
      <h2 className="mt-2 text-3xl font-light text-foreground">Come Away With Me</h2>
      <p className="mt-1 text-base text-muted-foreground">Norah Jones</p>
      <p className="mt-4 text-xs tracking-wide text-primary/80">Jazz & Blues · Canal 24h</p>
    </div>
  );
};
