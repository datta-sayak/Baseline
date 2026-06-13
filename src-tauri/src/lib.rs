mod modules;

#[tauri::command]
fn get_platform() -> String {
    std::env::consts::OS.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_platform,
            modules::filesystem::read_root_dir,
            modules::filesystem::read_child_dir,
            modules::filesystem::open_file,
            modules::filesystem::load_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
