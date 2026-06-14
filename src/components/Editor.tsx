import Editor from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface EditorProps {
  filePath: string | null;
}

const getLanguage = (filePath: string): string => {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":   return "javascript";
    case "ts":
    case "tsx":   return "typescript";
    case "py":    return "python";
    case "rs":    return "rust";
    case "html":  return "html";
    case "css":   return "css";
    case "json":  return "json";
    case "md":    return "markdown";
    case "yaml":
    case "yml":   return "yaml";
    case "sh":    return "shell";
    case "cpp":
    case "c":     return "cpp";
    case "go":    return "go";
    case "java":  return "java";
    case "sql":   return "sql";
    case "xml":   return "xml";
    default:      return "plaintext";
  }
};

function EditorPanel({ filePath }: EditorProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    if (!filePath) return;
    loadFile(filePath);
  }, [filePath]);

  const loadFile = async (path: string) => {
    try {
      const data = await invoke<string>("open_file", { path });
      setContent(data);
    } catch (err) {
      console.error("Failed to open file:", err);
    } finally {
        setLoading(false);
    }
  };

  if (!filePath || loading) {
    return (
      <div className="mt-40">Error</div>
    );
  }

  return (
      <div className="h-full w-full">
        <Editor
          height="100%"
          language={getLanguage(filePath)}
          value={content}
          onChange={(value) => {
            setContent(value ?? "");
          }}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            fontLigatures: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineNumbers: "on",
            renderLineHighlight: "line",
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: "off",
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            formatOnPaste: true,
            tabSize: 2,
            insertSpaces: true,
            padding: { top: 8 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
  );
}

export default EditorPanel;