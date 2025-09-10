import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { LessonList } from "./LessonList";
import { NewLessonModal } from "./NewLessonModal";

interface ChapterItemProps {
    item: {
        id: string;
        title: string;
        order: number;
        isOpen: boolean;
        lessons: {
            id: string;
            title: string;
            order: number;
        }[]
    };
    courseId: string;
    onToggleChapter: (chapterId: string) => void;
}

export function ChapterItem({ item, courseId, onToggleChapter }: ChapterItemProps) {
    return (
        <SortableItem 
            id={item.id}
            data={{type: 'chapter'}}
        >
            {(listeners) => (
                <Card>
                    <Collapsible 
                        open={item.isOpen} 
                        onOpenChange={() => onToggleChapter(item.id)}
                    >
                        <div className="flex items-center justify-between p-2 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Button 
                                    size="icon"
                                    variant="ghost"
                                    {...listeners}
                                >
                                    <GripVertical className="size-4" />
                                </Button>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                    >
                                        {item.isOpen ? (
                                          <ChevronDown className="size-4" />
                                        ) : (
                                          <ChevronRight className="size-4" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                                <p className="cursor-pointer hover:text-primary pl-2">{item.title}</p>
                            </div>
                            <Button size="icon" variant="outline">
                                <Trash2 />
                            </Button>
                        </div>
                        <CollapsibleContent>
                            <div className="p-1">
                                <SortableContext 
                                    items={item.lessons.map((lesson) => lesson.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <LessonList 
                                        lessons={item.lessons}
                                        chapterId={item.id}
                                        courseId={courseId}
                                    />
                                </SortableContext>
                                <div className="p-2">
                                    <NewLessonModal courseId={courseId} chapterId={item.id} />
                                </div>
                            </div>
                        </CollapsibleContent> 
                    </Collapsible>
                </Card>
            )}
        </SortableItem>
    );
}