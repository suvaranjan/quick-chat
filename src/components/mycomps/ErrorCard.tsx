import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorCard({
  message = "An error occurred. Please try again.",
}: {
  message?: string;
}) {
  return (
    <Card className="w-full max-w-md mx-auto mt-8 overflow-hidden bg-red-50 border-red-100">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
