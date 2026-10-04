/** Loading placeholders (they pulse until the real data arrives). */

const block = "animate-pulse rounded bg-slate-200/80";

export function FacultyCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`h-20 w-20 shrink-0 rounded-full ${block}`} />

        <div className="min-w-0 flex-1 space-y-2.5 pt-2">
          <div className={`h-4 w-3/4 ${block}`} />
          <div className={`h-3.5 w-1/2 ${block}`} />
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t pt-4">
        <div className={`h-3 w-24 ${block}`} />
        <div className={`h-3.5 w-full ${block}`} />
      </div>
    </div>
  );
}

export function FacultyListCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border bg-white p-3 shadow-sm sm:gap-5 sm:p-4">
      <div className="aspect-[3/4] w-[38%] min-w-[104px] max-w-[210px] shrink-0 animate-pulse rounded-xl bg-slate-200/80" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className={`h-5 w-3/4 ${block}`} />
        <div className={`mt-2 h-4 w-1/2 ${block}`} />
        <div className={`mt-5 h-3.5 w-2/3 ${block}`} />
        <div className={`mt-2.5 h-3.5 w-4/5 ${block}`} />
        <div className={`mt-auto h-9 w-32 rounded-full pt-4 ${block}`} />
      </div>
    </div>
  );
}

export function FacultyRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className={`h-16 w-16 shrink-0 rounded-sm ${block}`} />

      <div className="min-w-0 flex-1 space-y-2">
        <div className={`h-4 w-3/4 ${block}`} />
        <div className={`h-3.5 w-1/2 ${block}`} />
        <div className={`h-3 w-2/3 ${block}`} />
      </div>
    </div>
  );
}

export function GalleryCardSkeleton({
  tall = false,
}: {
  tall?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div
        className={`animate-pulse bg-slate-200/80 ${
          tall ? "aspect-[3/4]" : "aspect-[4/3]"
        }`}
      />

      <div className="space-y-2 p-4">
        <div className={`h-4 w-3/4 ${block}`} />
        <div className={`h-3 w-1/3 ${block}`} />
      </div>
    </div>
  );
}
