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

    return lesson;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>