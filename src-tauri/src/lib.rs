// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn get_platform() -> String {
    std::env::consts::OS.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_platform
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
