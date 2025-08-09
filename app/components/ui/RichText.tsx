import React, { forwardRef, useImperativeHandle, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextProps {
  value: string;
  setValue: (value: string) => void;
  onBlur?: (value: unknown) => void;
}

export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: ["right", "center", "justify"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const RichText = forwardRef((props: RichTextProps, ref) => {
  const { value, setValue, onBlur } = props;
  const quillRef = useRef<typeof ReactQuill>(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current,
  }));

  if (typeof window === "undefined") return null; // Prevent rendering on the server

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      onBlur={onBlur}
      modules={modules}
      placeholder="Type something..."
    />
  );
});

RichText.displayName = "RichText";

export default RichText;
