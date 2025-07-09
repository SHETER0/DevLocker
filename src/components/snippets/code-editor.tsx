import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "300px",
  className,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef(null);
  
  // Normalize language for Monaco editor
  const normalizedLanguage = language.toLowerCase();
  const monacoLanguage = 
    normalizedLanguage === "c#" ? "csharp" : 
    normalizedLanguage === "c++" ? "cpp" :
    normalizedLanguage;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted", 
          className
        )} 
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Editor
      height={height}
      language={monacoLanguage}
      value={value}
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      }}
      onMount={(editor) => {
        editorRef.current = editor;
        editor.focus();
      }}
      className={cn(
        "border rounded-md overflow-hidden",
        className
      )}
    />
  );
}