export function PostSkeleton() {
  return (
    <div className="card flex overflow-hidden animate-pulse">
      <div className="w-10 flex flex-col items-center py-3 gap-2">
        <div className="w-6 h-6 skeleton rounded-8" />
        <div className="w-5 h-3 skeleton rounded" />
        <div className="w-6 h-6 skeleton rounded-8" />
      </div>
      <div className="flex-1 px-3 py-3 space-y-2">
        <div className="flex gap-2">
          <div className="h-3 skeleton rounded w-20" />
          <div className="h-3 skeleton rounded w-16" />
        </div>
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 skeleton rounded-8 w-14" />
          <div className="h-6 skeleton rounded-8 w-12" />
        </div>
      </div>
    </div>
  );
}
