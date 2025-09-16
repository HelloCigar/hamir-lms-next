import 'server-only'

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";


export async function adminGetLesson(id: string) {
    await requireAdmin();

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: id
        }
    })

    if(!lesson) {
        return notFound();
    }

    const previous = await prisma.lesson.findFirst({
        where: {
            position: lesson.position - 1,
            chapterId: lesson.chapterId
        }
    })

    const next = await prisma.lesson.findFirst({
        where: {
            position: lesson.position + 1,
            chapterId: lesson.chapterId
        }
    })

    console.log(next)
    console.log(previous)

    

    return {
        lesson,
        previous,
        next
    };
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>