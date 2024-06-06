use tauri::Manager;
use std::time::Duration;
use std::error::Error;
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::Window;
use once_cell::sync::Lazy;

mod app_modules;
use app_modules::database::{Database, Torrent};
use app_modules::torrent_service::TorrentService;
use app_modules::provider_xatab::{ProviderXatab, get_torrent_info_xatab};
use app_modules::provider_0xempress::{Provider0xEMPRESS, get_torrent_info_0xempress};
use app_modules::provider_dodi::{ProviderDODI, get_torrent_info_dodi};
use app_modules::provider_fitgirl::{ProviderFitGirl, get_torrent_info_fitgirl};
use app_modules::provider_gog::{ProviderGOG, get_torrent_info_gog};
use app_modules::provider_kaoskrew::{ProviderKaOsKrew, get_torrent_info_kaoskrew};
use app_modules::provider_onlinefix::{ProviderOnlineFix, get_torrent_info_onlinefix};
use app_modules::provider_tinyrepacks::{ProviderTinyRepacks, get_torrent_info_tinyrepacks};
use app_modules::helpers::{get_database_path, is_database_old};
use app_modules::gamedata::{
    get_game_list,
    update_api_key,
    get_game_details,
    get_game_movies,
    get_game_screenshots,
    search_game};

static DB: Lazy<Arc<Mutex<Database>>> = Lazy::new(|| {
    Arc::new(Mutex::new(Database::new().unwrap()))
});

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

#[tauri::command]
async fn get_all_torrents() -> Result<Vec<Torrent>, String> {
    let torrent_service = TorrentService::new(DB.clone());
    torrent_service.get_all_torrents().await
}

async fn check_and_apply_updates(window: Window) -> Result<(), String> {
    match tauri::api::http::Updater::check_now().await {
        Ok(update) => {
            if update.should_update() {
                update_status(window.clone(), format!("Обновление до версии {}", update.version())).await;
                match update.update().await {
                    Ok(_) => update_status(window.clone(), "Обновление завершено. Перезагрузка...".into()).await,
                    Err(e) => {
                        eprintln!("Ошибка при обновлении: {}", e);
                        update_status(window.clone(), "Ошибка обновления".into()).await;
                        return Err("Failed to apply update".into());
                    }
                }
            }
        },
        Err(e) => {
            eprintln!("Ошибка проверки обновлений: {}", e);
            update_status(window.clone(), "Ошибка проверки обновлений".into()).await;
            return Err("Failed to check for updates".into());
        }
    }
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            update_status,
            get_game_list,
            get_game_details,
            search_game,
            get_game_screenshots,
            get_game_movies,
            get_all_torrents,
            get_torrent_info_0xempress,
            get_torrent_info_dodi,
            get_torrent_info_fitgirl,
            get_torrent_info_gog,
            get_torrent_info_kaoskrew,
            get_torrent_info_onlinefix,
            get_torrent_info_tinyrepacks,
            get_torrent_info_xatab
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            tokio::spawn(async move {
                if let Err(e) = check_and_apply_updates(window.clone()).await {
                    eprintln!("Ошибка при обновлении: {}", e);
                }

                update_status(window.clone(), "Обновление ключей".into()).await;
                match update_api_key().await {
                    Ok(api_key) => {
                        window.emit("api_key_updated", api_key).unwrap();
                    }
                    Err(e) => {
                        eprintln!("Failed to update API key: {}", e);
                        return;
                    }
                }

                let db_path = get_database_path().unwrap();
                let six_hours = Duration::from_secs(6 * 60 * 60);

                if is_database_old(&db_path, six_hours) {
                    let torrent_service = Arc::new(Mutex::new(TorrentService::new(DB.clone())));
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
