import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#050c1c] border shadow rounded-lg">
      {/* Avatar Skeleton */}
      <Skeleton className="w-10 h-10 rounded-full" />

      {/* Comment Content */}
      <div className="flex-1 space-y-3">
        {/* User Name and Timestamp */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>

        {/* Comment Text */}
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />

        {/* Like and Reply Buttons */}
        <div className="flex gap-3">
          <Skeleton className="w-12 h-6" />
          <Skeleton className="w-12 h-6" />
        </div>

        {/* Replies Section */}
        <div className="mt-4 lg:pl-10 lg:border-l border-gray-700 space-y-4">
          {/* Single Reply Skeleton */}
          <div className="flex items-start gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </div>

          {/* Expand/Collapse Button Skeleton */}
          <Skeleton className="w-24 h-6" />
        </div>
      </div>
    </div>
  );
}