import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { FileText, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";

interface LessonItemProps {
    lesson: {
        id: string;
        title: string;
        order: number;
    };
    chapterId: string;
    courseId: string;
    listeners: DraggableSyntheticListeners;
}

export function LessonItem({ lesson, chapterId, courseId, listeners }: LessonItemProps) {
    return (
        <div className="flex items-center justify-between p-1 hover:bg-accent rounded-sm">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"
                    {...listeners}
                >
                    <GripVertical className="size-4" />
                </Button>
                <FileText className="size-4" />
                <Link 
                    href={`/admin/courses/${courseId}/${chapterId}/${lesson.id}`}
                    className="pl-2"
                >
                    {lesson.title}
                </Link>
            </div> 
            <Button size="icon" variant="outline">
                <Trash2 />
            </Button>
        </div>
    );
}