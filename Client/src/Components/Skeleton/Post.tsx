import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="flex justify-center mt-10">
      <div className="lg:w-[82%] w-[95%] flex flex-col md:flex-row gap-3">
        
        {/* Left Column - Image Skeleton */}
        <div className="w-full md:w-[30%] dark:bg-gray-950 border rounded-xl p-6 flex items-center justify-center">
          <Skeleton className="w-full h-[300px] md:h-[80vh] object-contain rounded-xl" />
        </div>

        {/* Right Column - Post Details Skeleton */}
        <div className="w-full md:w-[70%] dark:bg-gray-950 border rounded-xl p-6 flex flex-col gap-3">
          
          {/* User Profile Row */}
          <div className="flex items-center justify-between lg:flex-row">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-24 h-4 mt-1" />
              </div>
            </div>
            <Skeleton className="w-16 h-8 rounded-md" />
          </div>

          {/* Post Title */}
          <Skeleton className="w-3/4 h-6" />
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>

          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-md" />
            <Skeleton className="w-14 h-6 rounded-md" />
            <Skeleton className="w-20 h-6 rounded-md" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-12 h-10 rounded-full" />
            <Skeleton className="w-12 h-10 rounded-full" />
            <Skeleton className="w-24 h-10 rounded-lg" />
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <Skeleton className="w-1/2 h-6" />
            <div className="mt-2 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-28 h-4" />
                  <Skeleton className="w-40 h-4 mt-1" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-36 h-4 mt-1" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
