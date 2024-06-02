use crate::app_modules::torrent_service::TorrentService;
use crate::app_modules::database::Torrent;
use reqwest::Client;
use scraper::{Html, Selector};
use tauri::Window;
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};
use crate::app_modules::formatters::tinyrepacks_formatter;
use crate::app_modules::helpers::format_name;
use fake_user_agent::get_rua;

use crate::app_modules::database::Database;

pub struct ProviderTinyRepacks {
    service: Arc<Mutex<TorrentService>>,
    client: Client,
    total_pages: u32,
    processed_pages: u32,
    max_page_in_queue: u32,
}

impl ProviderTinyRepacks {
    pub fn new(service: Arc<Mutex<TorrentService>>) -> Self {
        ProviderTinyRepacks {
            service,
            client: Client::new(),
            total_pages: 0,
            processed_pages: 0,
            max_page_in_queue: 0,
        }
    }

    pub async fn init_scraping(&mut self) -> Result<(), String> {
        match self.get_total_pages().await {
            Ok(total_pages) => {
                self.total_pages = total_pages;
                self.collect_pages(self.total_pages);
                Ok(())
            }
            Err(e) => {
                println!("Error getting total pages: {}", e);
                Ok(()) // Продолжаем выполнение даже при ошибке
            }
        }
    }

    async fn get_total_pages(&self) -> Result<u32, String> {
        let url = "https://www.1337xx.to/user/TinyRepacks/1";
        let text = self.fetch_web_content(url).await?;
        let document = Html::parse_document(&text);
        let selector = Selector::parse(".pagination > ul > li:last-child > a").unwrap();

        let total_pages = document.select(&selector)
            .next()
            .and_then(|element| element.text().next())
            .and_then(|text| text.parse::<u32>().ok())
            .unwrap_or(1);

        Ok(total_pages)
    }

    async fn collect_pages(&mut self, up_to_page: u32) {
        let (tx, mut rx) = mpsc::channel(10);

        for page in (self.max_page_in_queue + 1)..=up_to_page {
            let tx_clone = tx.clone();
            tokio::spawn(async move {
                tx_clone.send(page).await.unwrap();
            });
        }

        self.max_page_in_queue = up_to_page;

        let service = self.service.clone();
        let client = self.client.clone();
        tokio::spawn(async move {
            while let Some(page) = rx.recv().await {
                let service_clone = service.clone();
                let client_clone = client.clone();
                tokio::spawn(async move {
                    let mut provider = ProviderTinyRepacks {
                        service: service_clone,
                        client: client_clone,
                        total_pages: 0,
                        processed_pages: 0,
                        max_page_in_queue: 0,
                    };
                    match provider.process_page(page).await {
                        Ok(_) => {}
                        Err(e) => println!("Error processing page {}: {}", page, e),
                    }
                });
            }
        });
    }

    async fn process_page(&mut self, page: u32) -> Result<(), String> {
        let url = format!("https://www.1337xx.to/user/TinyRepacks/{}", page);
        match self.fetch_web_content(&url).await {
            Ok(data) => {
                if data.len() < 100 {
                    return Ok(());
                }

                let document = Html::parse_document(&data);
                let title_selector = Selector::parse(".table-list tbody tr td.coll-1.name a[href]:nth-of-type(2)").unwrap();

                for element in document.select(&title_selector) {
                    let title = element.text().collect::<Vec<_>>().join("");
                    let formatted_title = format_name(tinyrepacks_formatter(title));
                    let link = match element.value().attr("href") {
                        Some(url) => url.to_string(),
                        None => continue,
                    };

                    let torrent = Torrent {
                        id: "".to_string(),
                        name: formatted_title,
                        repacker: "TinyRepacks".to_string(),
                        torrent: "https://www.1337xx.to".to_owned() + &*link,
                    };

                    let service = self.service.clone();
                    tokio::spawn(async move {
                        if let Err(e) = service.lock().await.add_torrent(torrent).await {
                            println!("Ошибка при добавлении торрента: {}", e);
                        }
                    });
                }

                self.processed_pages += 1;
                Ok(())
            }
            Err(error) => {
                println!("Ошибка при обработке страницы {}: {}", page, error);
                Err(error)
            }
        }
    }

    pub async fn get_torrent_info(&self, url: &str) -> Result<(String, String), String> {
        match self.fetch_web_content(url).await {
            Ok(data) => {
                let document = Html::parse_document(&data);
                let list_selector = Selector::parse("ul.list > li").unwrap();
                let magnet_selector = Selector::parse("a[href^='magnet:']").unwrap();
    
                let updated = document.select(&list_selector)
                    .filter_map(|element| {
                        let text = element.text().collect::<Vec<_>>().join("");
                        if text.contains("Last checked") {
                            element.select(&Selector::parse("span").unwrap())
                                .next()
                                .map(|e| e.text().collect::<Vec<_>>().join(""))
                        } else {
                            None
                        }
                    })
                    .next()
                    .unwrap_or_else(|| "Unknown".to_string());
    
                let magnet = document.select(&magnet_selector)
                    .next()
                    .and_then(|element| element.value().attr("href").map(|s| s.to_string()))
                    .unwrap_or_else(|| "No magnet link found".to_string());
    
                Ok((updated, magnet))
            },
            Err(error) => {
                println!("Ошибка при получении информации о торренте {}: {}", url, error);
                Err(error)
            }
        }
    }

    async fn fetch_web_content(&self, url: &str) -> Result<String, String> {
        let user_agent = get_rua();
        
        self.client
            .get(url)
            .header("User-Agent", user_agent)
            .send()
            .await
            .map_err(|e| format!("Ошибка HTTP запроса: {}", e))?
            .text()
            .await
            .map_err(|e| format!("Ошибка чтения текста ответа: {}", e))
    }
}

#[tauri::command]
pub async fn get_torrent_info_tinyrepacks(url: String, window: Window) -> Result<(String, String), String> {
    let db = Arc::new(Mutex::new(Database::new().unwrap()));
    let torrent_service = Arc::new(Mutex::new(TorrentService::new(db.clone())));
    
    let provider = ProviderTinyRepacks::new(torrent_service);
    provider.get_torrent_info(&url).await
}
