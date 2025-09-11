import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="size-8 rounded-md"/>
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover"/>
            </div>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 rounded"/>
                <Skeleton className="h-4 w-full mb-4 rounded"/>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md"/>
                        <Skeleton className="h-4 w-10 rounded"/>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md"/>
                        <Skeleton className="h-4 w-10 rounded"/>
                    </div>
                </div>
                <Skeleton className="mt-4 h-10 w-full rounded" />
            </CardContent>
        </Card>
    )
}