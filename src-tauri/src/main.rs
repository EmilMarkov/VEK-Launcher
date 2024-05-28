mod app_modules;

use tauri::Manager;
use futures_timer::Delay;
use std::time::Duration;
use reqwest;
use tauri::Window;

use app_modules::database::{Database, Game, GameInput};
static mut DATABASE: Option<Database> = None;

#[tauri::command]
async fn fetch_web_content(url: String, _window: Window) -> Result<String, String> {
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

#[tauri::command]
async fn add_game(
    game: GameInput
) -> Result<(), String> {
    unsafe {
        match DATABASE {
            Some(ref mut db) => {
                match db.add_game(&game.title, game.description.as_deref(), game.screenshots.as_deref(), game.torrents.as_deref()) {
                    Ok(()) => {
                        println!("Game added successfully!");
                        Ok(())
                    }
                    Err(err) => {
                        eprintln!("Failed to add game: {}", err);
                        Err(format!("Failed to add game: {}", err))
                    }
                }
            }
            None => {
                eprintln!("Database not initialized!");
                Err("Database not initialized!".to_string())
            }
        }
    }
}

#[tauri::command]
async fn update_game(
    game: Game
) -> Result<(), String> {
    unsafe {
        match DATABASE {
            Some(ref mut db) => {
                match db.update_game(&game) {
                    Ok(()) => {
                        println!("Game updated successfully!");
                        Ok(())
                    }
                    Err(err) => {
                        eprintln!("Failed to update game: {}", err);
                        Err(format!("Failed to update game: {}", err))
                    }
                }
            }
            None => {
                eprintln!("Database not initialized!");
                Err("Database not initialized!".to_string())
            }
        }
    }
}


#[tauri::command]
async fn delete_game(game_id: &str) -> Result<(), String> {
    unsafe {
        match DATABASE {
            Some(ref mut db) => {
                match db.delete_game(game_id) {
                    Ok(()) => {
                        println!("Game deleted successfully!");
                        Ok(())
                    }
                    Err(err) => {
                        eprintln!("Failed to delete game: {}", err);
                        Err(format!("Failed to delete game: {}", err))
                    }
                }
            }
            None => {
                eprintln!("Database not initialized!");
                Err("Database not initialized!".to_string())
            }
        }
    }
}

#[tauri::command]
async fn get_game_by_id(game_id: &str) -> Result<Option<Game>, String> {
    unsafe {
        match DATABASE {
            Some(ref mut db) => {
                db.get_game_by_id(game_id).map_err(|err| format!("Failed to get game by id: {}", err))
            }
            None => {
                Err("Database not initialized!".to_string())
            }
        }
    }
}

#[tauri::command]
async fn get_all_games() -> Result<Vec<Game>, String> {
    unsafe {
        match DATABASE {
            Some(ref mut db) => {
                db.get_all_games().map_err(|err| format!("Failed to get all games: {}", err))
            }
            None => {
                Err("Database not initialized!".to_string())
            }
        }
    }
}

#[tauri::command]
async fn add_torrent_to_game(
    id: &str,
    torrent: &str
) -> Result<(), String> {
    unsafe {
        match DATABASE {
            Some(ref mut db) => {
                match db.add_torrent_to_game(id, torrent) {
                    Ok(()) => {
                        println!("Torrent added to game successfully!");
                        Ok(())
                    }
                    Err(err) => {
                        eprintln!("Failed to add torrent to game: {}", err);
                        Err(format!("Failed to add torrent to game: {}", err))
                    }
                }
            }
            None => {
                Err("Database not initialized!".to_string())
            }
        }
    }
}


fn main() {
    unsafe {
        DATABASE = Some(Database::new().expect("Failed to initialize database"));
    }

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
            fetch_file_buffer,
            add_game,
            delete_game,
            update_game,
            get_game_by_id,
            get_all_games,
            add_torrent_to_game
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
