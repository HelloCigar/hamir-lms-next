"use client"

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align" 
import { Menubar } from "./Menubar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RichTextEditor({ field }: { field: any }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            })
        ],
        immediatelyRender: false,
        
        editorProps: {
            attributes: {
                class: "min-h-[300px] px-3 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none"
            }
        },

        onUpdate: ({editor}) => {
            field.onChange(JSON.stringify(editor.getJSON()))
        },

        content: field.value ? JSON.parse(field.value): '<p>Make your description creative!</p>'
    });

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}