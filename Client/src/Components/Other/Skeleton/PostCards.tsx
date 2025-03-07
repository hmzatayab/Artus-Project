import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "../../ui/card";

export function PostCards() {
  return (
    <div className="mx-auto px-4 md:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="mt-4 shadow-lg dark:shadow-gray-800/50 shadow-gray-500/50 dark:bg-gray-950 bg-gray-200 rounded-lg overflow-hidden h-fit p-4 transition duration-500">
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
      ))}
    </div>
  );
}
