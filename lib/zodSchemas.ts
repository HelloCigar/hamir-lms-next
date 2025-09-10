import { z } from "zod/v3";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const
export const courseStatus = ["Draft", "Published", "Archive"] as const

export const coursCategories = [
    "Development",
    "Business",
    "IT and Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Health and Fitness",
    "Music",
    "Teaching and Academics"
] as const

export const courseSchema = z.object({
    title: z.string()
        .min(3, { message: "Title must be at least 3 characters long"})
        .max(100, { message: "Title must be at most 100 characters long"}),

    description: z.string()
        .min(3, { message: "Description must be at least 3 characters long"}),

    filekey: z.string()
        .min(1, { message: "File is required"}),

    price: z.coerce
        .number()
        .min(1, { message: "Price must be a positive number"}),

    duration: z.coerce
        .number()
        .min(1, { message: "Duration must be at least 1 hour"})
        .max(500, { message: "Duration must be at most 500 hours"}),

    level: z.enum(courseLevels, { message: "Level is required"}),
    category: z.enum(coursCategories, { message: "Category is required"}),

    smallDescription: z.string()
        .min(3, { message: "Small description must be at least 3 characters long"})
        .max(200, { message: "Small description must be at most 200 characters long"}),

    slug: z.string()
        .min(3, { message: "Slug must be at least 3 characters long"}),

    status: z.enum(courseStatus, { message: "Status is required"}),
})

export const chapterSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long"}),
    courseId: z.string().uuid({ message: "Invalid course id" })
})

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;