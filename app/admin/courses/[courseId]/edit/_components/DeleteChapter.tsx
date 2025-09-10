import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteChapter } from "../actions";
import { toast } from "sonner";

export function DeleteChapter({
    chapterId,
    courseId,
}: { 
    chapterId: string,
    courseId: string,
}) {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition()

    async function onSubmit() {
        startTransition(async () => {
            const { data: result, error} = await tryCatch(deleteChapter({ chapterId, courseId }))

            if(error) {
                toast.error("An unexpected error occured");
                return;
            }

            if (result.status === 'success') {
                toast.success(result.message);
                setOpen(false);
            } else if (result.status === 'error') {
                toast.error(result.message);
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will <span className="text-destructive">permanently</span> delete this chapter and the included lessons. It <span className="text-destructive">cannot</span> be undone.
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={pending}>
                        { pending ? (
                            "Deleting..."
                        ) : (
                            "Delete"
                        ) }
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}