#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod features;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            features::home::get_home_summary,
            features::all_notes::list_all_notes
        ])
        .run(tauri::generate_context!())
        .expect("error while running application");
}
