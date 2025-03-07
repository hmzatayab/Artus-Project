import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "../../ui/card";

export function PostCardSkeleton() {
  return (

    <Card className="mt-4 shadow-lg dark:shadow-gray-800/50 shadow-gray-500/50 dark:bg-gray-950 bg-gray-200 rounded-lg overflow-hidden h-fit p-4 transition duration-500">
      {/* Post Image Skeleton */}
      <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
        <Skeleton className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* User Details & Actions Skeleton */}
      <div className="flex items-center justify-between w-full mt-4">
        {/* User Profile Skeleton */}
        <div className="flex justify-start items-center w-auto">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="w-24 h-4" />
              <div className="flex items-center space-x-1 mt-2">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions (Like & Comment) Skeleton */}
        <div className="flex items-center justify-end w-auto">
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>
    </Card>

  );
}
