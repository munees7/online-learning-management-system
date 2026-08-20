export function CourseSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-44 bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
    </div>
  );
}
