import { Skeleton } from "@/components/ui/skeleton";

/** Shown while scene background is loading or has failed. */
export const HeroSkeleton = () => {
  return (
    <div className="pointer-events-none max-w-2xl animate-pulse" aria-hidden>
      <Skeleton className="h-14 w-3/4 rounded-xl bg-white/5" />
      <Skeleton className="mt-4 h-14 w-1/2 rounded-xl bg-white/5" />
      <Skeleton className="mt-8 h-5 w-2/3 rounded-md bg-white/5" />
      <div className="mt-10 flex gap-3">
        <Skeleton className="h-14 w-44 rounded-2xl bg-white/5" />
        <Skeleton className="h-14 w-44 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
};
