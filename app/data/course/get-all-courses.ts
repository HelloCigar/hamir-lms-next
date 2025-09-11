import { prisma } from "@/lib/db";

export async function getAllCourses() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await prisma.course.findMany({
        where: {
            status: 'Published'
        },
        orderBy: {
            createdAt: 'asc'
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            description: true,
            slug: true,
            filekey: true,
            id: true,
            level: true,
            duration: true,
            category: true
        }
    });

    return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]