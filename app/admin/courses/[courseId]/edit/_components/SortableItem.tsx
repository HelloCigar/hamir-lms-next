import { useSortable } from "@dnd-kit/sortable";
import { ReactNode } from "react";
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson'
        chapterId?: string; //only relevant for lessons
    }
}

export function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: id, data: data});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes}
            className={cn(
                "touch-none", className,
                isDragging ? "z-10" : ""
            )}
        >
            {children(listeners)}
        </div>
    )
}