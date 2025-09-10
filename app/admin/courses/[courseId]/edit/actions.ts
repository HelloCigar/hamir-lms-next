"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
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