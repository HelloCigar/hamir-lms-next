"use client"

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateLesson } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";


interface iAppProps {
    data: AdminLessonType;
    chapterId: string,
    courseId: string
}

export default function LessonForm({ data, chapterId, courseId}: iAppProps) {
    const [pending, startTransition] = useTransition();
    const { lesson, next, previous } = data;

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: lesson.title,
            chapterId: chapterId,
            courseId: courseId,
            description: lesson.description ?? undefined,
            videoKey: lesson.videoKey ?? undefined,
            thumbnailKey: lesson.thumbnailKey ?? undefined
        }
    })

   function onSubmit(values: LessonSchemaType) {
        // console.log(values)
        startTransition(async() => {
            const { data: result, error } = await tryCatch(updateLesson(values, lesson.id));

            if (error) {
                toast.error("An unexpected error occurred. Please try again")
                return;
            }

            if (result.status === 'success') {
                toast.success(result.message)
            } else if (result.status === "error") {
                toast.success(result.message)
            }
        })
    }

    return (
        <div>
           <Link 
                className={buttonVariants({
                    variant: 'outline',
                    className: "mb-6"
                })}
                href={`/admin/courses/${courseId}/edit`}>
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
           </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>
                        Configure the video and description for this lesson.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lesson Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="videoKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center mt-12">
                                <div className="flex-1">
                                    {previous && (
                                        <Link 
                                            className={buttonVariants({ variant: 'secondary' })}
                                            href={`/admin/courses/${courseId}/${chapterId}/${previous.id}`}
                                        >
                                            <ArrowLeft className="size-4" />
                                            {previous.title}
                                        </Link>
                                    )}
                                </div>

                                <div className="flex-shrink-0 mx-4">
                                    <Button type="submit" disabled={pending}>
                                    {pending ? "Saving..." : "Save Lesson"}
                                    </Button>
                                </div>

                                <div className="flex-1 flex justify-end">
                                    {next && (
                                        <Link 
                                            className={buttonVariants({ variant: 'secondary' })}
                                            href={`/admin/courses/${courseId}/${chapterId}/${next.id}`}
                                        >
                                            {next.title}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                </div>
                                </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}