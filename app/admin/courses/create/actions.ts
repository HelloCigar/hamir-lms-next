"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";


export async function CreateCourse(data: CourseSchemaType): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const validation = courseSchema.safeParse(data);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data"
            }
        }

        const stripe_prod = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data: {
                currency: 'php',
                unit_amount: validation.data.price * 100
            },
            images: [
                `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${validation.data.filekey}`
            ]
        })

        try {
            await prisma.course.create({
                data: {
                    ...validation.data,
                    userId: session?.user.id as string,
                    stripePriceId: stripe_prod.default_price as string
                }
            })
        } catch (error) {
            console.log(error)
        }

        return {
            status: "success",
            message: "Course created succesfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to create course."
        }
    }
}