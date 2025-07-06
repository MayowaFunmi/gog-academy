import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RichText = ({ value, setValue }: { value: any, setValue: any }) => {
  if (typeof window === "undefined") return null; // Prevent rendering on the server

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      placeholder="Type here..."
    />
  );
};

export default RichText;
