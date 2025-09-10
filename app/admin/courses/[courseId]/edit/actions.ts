"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
.withRule(
    detectBot({
        mode: 'LIVE',
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: 'LIVE',
        window: "1m",
        max: 5,
    })
)
export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const req =  await request();
        const decision = await aj.protect(req, {
            fingerprint: session.user.id
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "You have been blocked due to rate limiting",
                }
            } else {
                return {
                    status: 'error',
                    message: 'You are probably a bot. Contact our suppport if your think this is a mistake'
                }
            }
        }
        
        const result = courseSchema.safeParse(data);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data"
            }
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: session.user.id
            },
            data: {
                ...data
            }
        })
        
        return {
            status: "success",
            message: "Course updated successfully"
        }
    } catch  {
        return {
            status: "error",
            message: "Failed to update course"
        }
    }

}

export async function reorderLessons(
    chapterId: string,
    lessons: { id: string; position: number }[] ,
    courseId: string
): Promise<ApiResponse> {
    await requireAdmin();
    
    try {
        if(!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons provide for reordering."
            }
        }

        const updates = lessons.map((lesson) => prisma.lesson.update({
            where: {
                id: lesson.id,
                chapterId: chapterId,
            },
            data: {
                position: lesson.position,
            }
        }));

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to reorder lessons"
        }
    }
}

export async function reorderChapters(
    courseId: string, 
    chapters: { id: string, position: number}[]
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters provided for reordering"
            }
        }

        const updates = chapters.map((chapter) => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: courseId
            },
            data: {
                position: chapter.position
            }
        }))

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: 'success',
            message: "Chapters successfully reordered"
        }

    } catch {
        return {
            status: 'error',
            message: "Failed to reorder chapters"
        }
    } 
}

export async function createChapter(
    values: ChapterSchemaType
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        const result = chapterSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid Data"
            }
        }

        console.log("here")

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc'
                }
            })

            await tx.chapter.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Chapter created successfully!"
        }

         
    } catch {
        return {
            status: "error",
            message: "Failed to create chapter"
        }
    }
}

export async function createLesson(
    values: LessonSchemaType
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid Data"
            }
        }

        await prisma.$transaction(async (tx) => {
           
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc'
                }
            })

            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    chapterId: result.data.chapterId,
                    description: result.data.description,
                    videoKey: result.data.videoKey, 
                    thumbnailKey: result.data.thumbnailKey,
                    position: (maxPos?.position ?? 0) + 1
                }
            })
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Lesson created successfully!"
        }

         
    } catch {
        return {
            status: "error",
            message: "Failed to create lesson"
        }
    }
}

export async function deleteLesson({
    chapterId,
    courseId,
    lessonId
}: { 
    chapterId: string,
    courseId: string,
    lessonId: string
}): Promise<ApiResponse> {
    await requireAdmin(); 

    try {

        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
            select: {
                lessons: {
                    orderBy: {
                        position: 'asc'
                    },
                    select: {
                        id: true,
                        position: true
                    }
                }
            }
        })

        if (!chapterWithLessons) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }

        const lessons = chapterWithLessons.lessons;

        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson not found in the chapter"
            }
        }

        const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: { id: lesson.id },
                data: { position: index + 1 }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId
                }
            })
        ])

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: 'success',
            message: "Lesson deleted successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to delete lesson"
        }
    }
}