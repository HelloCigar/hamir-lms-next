import 'server-only'
import { requireUser } from '../user/require-user'
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function getCourseSidebarData(slug: string) {
    const user = await requireUser();

    const course = await prisma.course.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            title: true,
            filekey: true,
            duration: true,
            level: true,
            category: true,
            slug: true,
            chapters: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            description: true,
                            lessonProgress: {
                                where: {
                                    userId: user.id
                                },
                                select: {
                                    completed: true,
                                    lessonId: true,
                                    id: true
                                }
                            }
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });


    if(!course) {
        return notFound()
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            }
        }
    });

    if(!enrollment || enrollment.status !== 'Active') {
        return notFound()
    }

    return {
        course
    };
}

export type CourseSidebarDataType = Awaited<ReturnType <typeof getCourseSidebarData>>