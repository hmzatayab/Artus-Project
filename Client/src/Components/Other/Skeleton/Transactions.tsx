import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TransactionHistorySkeleton() {
  return (

      <div className="space-y-2 overflow-y-auto max-h-[360px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 mt-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Card
            key={index}
            className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-950 p-4 rounded-lg hover:bg-gray-600 transition mt-2"
          >
            {/* Left Section - User Details */}
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              {/* Sender Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-24 h-4" />
              </div>

              {/* Arrow Skeleton */}
              <Skeleton className="w-4 h-4" />

              {/* Recipient Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>

            {/* Right Section - Amount & Time */}
            <div className="flex flex-col items-end text-right w-full sm:w-auto mt-2 sm:mt-0">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-24 h-3 mt-2" />
            </div>
          </Card>
        ))}
      </div>
  );
}