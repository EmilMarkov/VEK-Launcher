// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use settimeout::set_timeout;
use std::time::Duration;

mod app_modules;
use app_modules::file;

// use app_modules::module_name::{item};

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        set_timeout(Duration::from_millis(100)).await;
        splashscreen.close().unwrap();
    }

    // Show main window
    set_timeout(Duration::from_millis(500)).await;
    window.get_window("main").unwrap().show().unwrap();
}
fn main() {
    // This should be called as early in the execution of the app as possible
    #[cfg(debug_assertions)] // only enable instrumentation in development builds
    let devtools = devtools::init();

    let builder = tauri::Builder::default();

    #[cfg(debug_assertions)]
    let builder = builder.plugin(devtools);

    builder
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            file::fetch_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
