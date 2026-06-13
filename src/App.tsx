import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Titlebar from "./components/Titlebar";
import FilePanel from "./components/FilePanel"
import "./App.css";

function App() {
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    invoke<string>("get_platform").then(setPlatform);
  }, []);

  const isLinux = platform === "linux";

  return (
    <div className="flex flex-col h-screen w-screen">
      {isLinux && <Titlebar />}
      <FilePanel />
    </div>
  );
}

export default App;