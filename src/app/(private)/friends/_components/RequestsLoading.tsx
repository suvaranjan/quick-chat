// RequestsLoading.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingCard = () => {
  return (
    <Card className="mb-2">
      <CardContent className="flex items-center p-4">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        {/* Username and Buttons Skeleton Section */}
        <div className="flex flex-col md:flex-row md:justify-between ml-4 flex-grow md:items-center">
          {/* Username Skeleton */}
          <Skeleton className="w-32 h-6 mb-2 md:mb-0" />
          {/* Buttons Skeleton */}
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Skeleton className="w-20 h-8" />
            <Skeleton className="w-20 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RequestsLoading({ required }: { required: number }) {
  return (
    <div className="px-4">
      {[...Array(required)].map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}
