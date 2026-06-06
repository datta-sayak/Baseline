import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Titlebar from "./components/Titlebar";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    invoke<string>("get_platform").then(setPlatform);
  }, []);

  const isLinux = platform === "linux";

  return (
    <div className="flex flex-col h-screen w-screen bg-[#121212]">
      {isLinux && <Titlebar />}

      <div className={`${isLinux ? "mt-[30px]" : ""} flex-1 overflow-auto text-white p-4`}>
        Baseline Editor
      </div>
    </div>
  );
}

export default App;