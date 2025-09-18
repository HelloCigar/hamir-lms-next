"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState, useRef } from "react";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";
import { ChapterItem } from "./ChapterItem";

interface iAppProps {
    data: AdminCourseSingularType
}


export function CourseStructure({ data }: iAppProps) {
    const isDraggingRef = useRef(false);
    
    const initialItems = data.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true, //default open
        lessons: chapter.lessons
            .sort((a, b) => a.position - b.position)
            .map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                order: lesson.position
            }))
    })) || [];

    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        // Don't update state if we're currently dragging
        if (isDraggingRef.current) return;
        
        setItems((prevItems) => {
            const updatedItems = data.chapters.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: 
                   prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
                lessons: chapter.lessons
                    .sort((a, b) => a.position - b.position) // Ensure lessons are sorted
                    .map((lesson) => ({
                        id: lesson.id,
                        title: lesson.title,
                        order: lesson.position
                    }))
            })) || []

            return updatedItems;
        })
    }, [data])

    useEffect(() => {
        toast.info("Click on each lesson to modify it's contents!")
    }, [])

    function handleDragEnd(event: DragEndEvent) {
        isDraggingRef.current = false;
        
        const { active, over } = event;
        
        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const activeType = active.data.current?.type as "chapter" | "lesson";
        const overType = over.data.current?.type as "chapter" | "lesson";
        const courseId = data.id

        if (activeType === 'chapter') {
            let targetChapterId = null;

            if(overType === 'chapter') {
                targetChapterId = overId;
            } else if (overType === 'lesson') {
                targetChapterId = over.data.current?.id ?? null
            }

            if(!targetChapterId) {
                toast.error("Could not determine the chapter for reordering")
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === targetChapterId);

            if(oldIndex === -1 || newIndex === -1) {
                toast.error("Could not find chapter old/new index for reordering");
                return;
            }

            const reorderedLocalChapters = arrayMove(items, oldIndex, newIndex);

            const updatedChapterForState = reorderedLocalChapters.map((chapter, index) => ({
                ...chapter,
                order: index + 1
            }));

            const previousItems = [...items];

            setItems(updatedChapterForState);

            if (courseId) {
                const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
                    id: chapter.id,
                    position: chapter.order,
                }))

                const reorderChaptersPromise = () => reorderChapters(courseId, chaptersToUpdate);

                toast.promise(reorderChaptersPromise(), {
                    loading: "Reordering chapters...",
                    success: (result) => {
                        if (result.status === 'success') return result.message;
                        throw new Error(result.message)
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder chapters"
                    }
                })
            }

            return;
        }

        if (activeType === 'lesson' && overType === 'lesson') {
            const chapterId = active.data.current?.chapterId;
            const overChapterId = over.data.current?.chapterId;

            if(!chapterId || chapterId !== overChapterId) {
                toast.error(
                    "Lesson move between different chapters or invalid chapter ID is not allowed."
                )
                return;
            }

            const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId);
            if (chapterIndex === -1) {
                toast.error("Could not find chapter for the lesson")
                return;
            }

            const chapterToUpdate = items[chapterIndex];
            const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => 
                (lesson.id === activeId));

            const newLessonIndex = chapterToUpdate.lessons.findIndex(
                (lesson) => lesson.id == overId)

            if (oldLessonIndex === -1 || newLessonIndex === -1) {
                toast.error("Could not find lesson for reordering")
                return;
            }

            const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);

            const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
                ...lesson,
                order: index + 1,
            }))

            const newItems = [...items]

            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: updatedLessonForState
            }

            const previousItems = [...items];

            setItems(newItems);

            if (courseId) {
                const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
                    id: lesson.id,
                    position: lesson.order,
                }))

                const reorderLessonsPromise = () => reorderLessons(chapterId, lessonsToUpdate, courseId);

                toast.promise(reorderLessonsPromise(), {
                    loading: "Reordering lessons...",
                    success: (result) => {
                        if (result.status === 'success') return result.message;
                        throw new Error(result.message)
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder lessons"
                    }
                })
            }

            return;
        }
    }

    function toggleChapter(chapterId: string) {
        setItems(
            items.map((chapter) => (
                chapter.id === chapterId ? 
                    {...chapter, isOpen: !chapter.isOpen} : 
                    chapter
            ))
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    return (
        <DndContext 
            collisionDetection={rectIntersection} 
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                     <SortableContext 
                        strategy={verticalListSortingStrategy}
                        items={items}
                        >
                        {items.map((item) => (
                            <ChapterItem 
                                key={item.id}
                                item={item}
                                courseId={data.id}
                                onToggleChapter={toggleChapter}
                            />
                        ))}
                     </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    )
}