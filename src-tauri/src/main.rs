use tauri::Manager;
use std::time::Duration;
use std::error::Error;
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::Window;

mod app_modules;
use app_modules::database::Database;
use app_modules::torrent_service::TorrentService;
use app_modules::provider_xatab::ProviderXatab;
use crate::app_modules::provider_0xempress::Provider0xEMPRESS;
use crate::app_modules::provider_dodi::ProviderDODI;
use crate::app_modules::provider_fitgirl::ProviderFitGirl;
use crate::app_modules::provider_gog::ProviderGOG;
use crate::app_modules::provider_kaoskrew::ProviderKaOsKrew;
use crate::app_modules::provider_onlinefix::ProviderOnlineFix;
use crate::app_modules::provider_tinyrepacks::ProviderTinyRepacks;
use crate::app_modules::helpers::{get_database_path, is_database_old};

#[tauri::command]
fn fetch_web_content(url: String, _window: Window) -> Result<String, String> {
    let client = reqwest::blocking::Client::new();
    let response = client.get(&url).send();

    match response {
        Ok(res) => {
            if res.status().is_success() {
                match res.text() {
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
fn fetch_file_buffer(url: String, _window: Window) -> Result<Vec<u8>, String> {
    let client = reqwest::blocking::Client::new();
    let response = client.get(&url).send();

    match response {
        Ok(res) => {
            if res.status().is_success() {
                match res.bytes() {
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
fn close_splashscreen(window: Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        std::thread::sleep(Duration::from_millis(100));
        splashscreen.close().unwrap();
    }

    std::thread::sleep(Duration::from_millis(500));
    window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
async fn update_status(window: Window, status: String) {
    window.emit("update_status", status).unwrap();
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            fetch_web_content,
            fetch_file_buffer,
            update_status
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            tokio::spawn(async move {
                let db_path = get_database_path().unwrap();
                let six_hours = Duration::from_secs(6 * 60 * 60);

                if is_database_old(&db_path, six_hours) {
                    let db = Arc::new(Mutex::new(Database::new().unwrap()));
                    let torrent_service = Arc::new(Mutex::new(TorrentService::new(db.clone())));

                    let mut provider_xatab = ProviderXatab::new(torrent_service.clone());
                    let mut provider_fitgirl = ProviderFitGirl::new(torrent_service.clone());
                    let mut provider_dodi = ProviderDODI::new(torrent_service.clone());
                    let mut provider_0xempress = Provider0xEMPRESS::new(torrent_service.clone());
                    let mut provider_kaoskrew = ProviderKaOsKrew::new(torrent_service.clone());
                    let mut provider_tinyrepacks = ProviderTinyRepacks::new(torrent_service.clone());
                    let mut provider_gog = ProviderGOG::new(torrent_service.clone());
                    let mut provider_onlinefix = ProviderOnlineFix::new(torrent_service.clone());

                    update_status(window.clone(), "Инициализация Xatab".into()).await;
                    provider_xatab.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация FitGirl".into()).await;
                    provider_fitgirl.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация DODI".into()).await;
                    provider_dodi.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация 0xEMPRESS".into()).await;
                    provider_0xempress.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация KaOsKrew".into()).await;
                    provider_kaoskrew.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация TinyRepacks".into()).await;
                    provider_tinyrepacks.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация GOG".into()).await;
                    provider_gog.init_scraping().await.unwrap();

                    update_status(window.clone(), "Инициализация Online-Fix".into()).await;
                    provider_onlinefix.init_scraping().await.unwrap();
                }

                close_splashscreen(window);
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
