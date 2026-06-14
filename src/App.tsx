import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Titlebar from "./components/Titlebar";
import FilePanel from "./components/FilePanel"
import Editor from "./components/Editor";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showFilePanel, setShowFilePanel] = useState<boolean>(true);

  useEffect(() => {
    invoke<string>("get_platform").then(setPlatform);
  }, []);

  const isLinux = platform === "linux";

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    setShowFilePanel(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {isLinux && <Titlebar />}
      <div className="flex flex-1 overflow-hidden">
        {showFilePanel && <FilePanel onFileSelect={handleFileSelect}/>}
        <Editor filePath={selectedFile} />
      </div>
    </div>
  );
}

export default App;