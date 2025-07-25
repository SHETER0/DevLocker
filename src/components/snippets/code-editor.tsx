import { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react"; // <-- Import useMonaco
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
  className,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [editorHeight, setEditorHeight] = useState("200px");
  const editorRef = useRef<any>(null);
  const monaco = useMonaco(); // <-- Access Monaco instance

  const normalizedLanguage = language.toLowerCase();
  const monacoLanguage =
    normalizedLanguage === "c#"
      ? "csharp"
      : normalizedLanguage === "c++"
      ? "cpp"
      : normalizedLanguage;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Load GitHub Dark Theme
  useEffect(() => {
    if (monaco) {
      import("monaco-themes/themes/GitHub Dark.json").then((themeData) => {
        monaco.editor.defineTheme("github-dark", themeData as any);
        monaco.editor.setTheme("github-dark");
      });
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    if (monaco) {
      import("monaco-themes/themes/GitHub Dark.json").then((themeData) => {
        monaco.editor.defineTheme("github-dark", themeData as any);
        monaco.editor.setTheme("github-dark");
      });
    }
    editorRef.current = editor;
    editor.focus();

    editor.onDidContentSizeChange(() => {
      const contentHeight =
        editor.getContentHeight() < 200 ? 200 : editor.getContentHeight();
      setEditorHeight(`${contentHeight}px`);
    });
  };

  if (!mounted) {
    return (
      <div
        className={cn("border rounded-md overflow-hidden", className)}
        style={{ height: editorHeight }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Editor
      height={editorHeight}
      language={monacoLanguage}
      value={value}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
          handleMouseWheel: false,
        },
      }}
      className={cn("border rounded-md overflow-hidden", className)}
    />
  );
}
