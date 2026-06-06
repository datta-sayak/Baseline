import { getCurrentWindow } from "@tauri-apps/api/window";

function Titlebar() {
  const appWindow = getCurrentWindow();
  
  const close = () => appWindow.close();
  const minimize = () => appWindow.minimize();
  const maximize = async () => {
    const isMaximized = await appWindow.isMaximized();
    if (isMaximized) {
      appWindow.unmaximize();
    } else {
      appWindow.maximize();
    }
  };

  return (
    <div className="h-[30px] bg-[#1e1e1e] select-none grid grid-cols-[auto_max-content] fixed top-0 left-0 right-0 z-50">

      <div data-tauri-drag-region className="w-full h-full" />

      <div className="flex">
        <button
          onClick={minimize}
          title="minimize"
          className="appearance-none p-0 m-0 border-none inline-flex justify-center items-center w-[30px] h-[30px] bg-transparent text-white hover:bg-white/10 cursor-pointer transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13H5v-2h14z" />
          </svg>
        </button>

        <button
          onClick={maximize}
          title="maximize"
          className="appearance-none p-0 m-0 border-none inline-flex justify-center items-center w-[30px] h-[30px] bg-transparent text-white hover:bg-white/10 cursor-pointer transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
          </svg>
        </button>

        <button
          onClick={close}
          title="close"
          className="appearance-none p-0 m-0 border-none inline-flex justify-center items-center w-[30px] h-[30px] bg-transparent text-white hover:bg-red-600 cursor-pointer transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13.46 12L19 17.54V19h-1.46L12 13.46L6.46 19H5v-1.46L10.54 12L5 6.46V5h1.46L12 10.54L17.54 5H19v1.46z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Titlebar;