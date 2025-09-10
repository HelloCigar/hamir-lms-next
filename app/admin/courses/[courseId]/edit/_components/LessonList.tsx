import { SortableItem } from "./SortableItem";
import { LessonItem } from "./LessonItem";

interface LessonListProps {
    lessons: {
        id: string;
        title: string;
        order: number;
    }[];
    chapterId: string;
    courseId: string;
}

export function LessonList({ lessons, chapterId, courseId }: LessonListProps) {
    return (
        <>
            {lessons.map((lesson) => (
                <SortableItem
                    key={lesson.id}
                    id={lesson.id}
                    data={{type: 'lesson', chapterId: chapterId}}
                >
                    {(lessonListeners) => (
                        <LessonItem 
                            lesson={lesson}
                            chapterId={chapterId}
                            courseId={courseId}
                            listeners={lessonListeners}
                        />
                    )}
                </SortableItem>
            ))}
        </>
    );
}