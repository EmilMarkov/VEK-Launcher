// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use futures_timer::Delay;
use std::time::Duration;
use reqwest;
use tauri::Window;
use bytes::Bytes;

#[tauri::command]
async fn fetch_web_content(url: String, window: Window) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                match res.text().await {
                    Ok(text) => Ok(text),
                    Err(_) => Err("Failed to read response text".into())
                }
            } else {
                Err(format!("HTTP error: {}", res.status()))
            }
        },
        Err(e) => Err(format!("Failed to fetch URL: {}", e)),
    }
}

#[tauri::command]
async fn fetch_file_buffer(url: String, _window: Window) -> Result<Vec<u8>, String> {
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                match res.bytes().await {
                    Ok(bytes) => Ok(bytes.to_vec()),
                    Err(_) => Err("Failed to read response data".into())
                }
            } else {
                Err(format!("HTTP error: {}", res.status()))
            }
        },
        Err(e) => Err(format!("Failed to fetch URL: {}", e)),
    }
}

#[tauri::command]
async fn close_splashscreen(window: Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        Delay::new(Duration::from_millis(100)).await;
        splashscreen.close().unwrap();
    }

    // Show main window
    Delay::new(Duration::from_millis(500)).await;
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
            fetch_web_content,
            fetch_file_buffer
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
