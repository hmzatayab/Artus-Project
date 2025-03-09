import { Card } from "@/Components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AuctionCardSkeleton() {
  return (
    <Card className="bg-gray-950 w-[82%] px-10 py-5 rounded-lg">
      <div className="flex items-center justify-between">
        {/* Auction Time Skeleton */}
        <div className="text-center lg:text-left">
          <Skeleton className="w-40 h-6 mb-2" />
          <div className="flex space-x-4 text-gray-300 mt-1">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        
        {/* Bidders List Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-3">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-12 h-12 rounded-full border-2 border-white" />
            ))}
          </div>
          <div>
            <Skeleton className="w-12 h-6" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
        
        {/* Highest Bidder Skeleton */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-14 h-14 rounded-full border-2 border-yellow-400" />
          <div className="text-white">
            <Skeleton className="w-24 h-6 mb-1" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
        
        {/* Place Bid Button Skeleton */}
        <Skeleton className="w-32 h-10 rounded-full" />
      </div>
    </Card>
  );
}
