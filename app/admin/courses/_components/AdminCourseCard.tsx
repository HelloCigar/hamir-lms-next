import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowRight, Eye, MoreVertical, Pencil, School, Timer, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    course: AdminCourseType;
}

export function AdminCourseCard({ course }: iAppProps) {
    const thumbnailUrl = useConstructUrl(course.filekey);

    return (
        <Card className="group relative py-0 gap-0">
            {/* absolute dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/edit`}>
                                <Pencil className="size-4 mr-2" />
                                Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.slug}`}>
                                <Eye className="size-4 mr-2" />
                                Preview
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/delete`}>
                                <Trash2 className="size-4 mr-2 text-destructive" />
                                Delete Course
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image 
                className="w-full rounded-t-lg aspect-video h-full object-cover"
                width={600}
                height={400} 
                src={thumbnailUrl} 
                alt="Thumbnail" 
            />
            <CardContent className="p-4">
                <Link 
                    href={`/admin/courses/${course.id}/edit`}
                    className="font-medium text-lg line-clamp-2
                    hover:underline group-hover:text-primary transition-colors"
                >
                    {course.title}
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                    {course.smallDescription}
                </p>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Timer className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{course.duration} hr</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{course.level}</p>
                    </div>
                </div>
                <Link href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({
                        className: "w-full mt-4"
                    })}
                >
                    Edit Course <ArrowRight className="size-4" />
                </Link>
            </CardContent>
        </Card>
    )
}
