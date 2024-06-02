use crate::app_modules::torrent_service::TorrentService;
use crate::app_modules::database::Torrent;
use reqwest::Client;
use scraper::{Html, Selector};
use tauri::Window;
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};
use crate::app_modules::formatters::xatab_formatter;
use crate::app_modules::helpers::format_name;
use fake_user_agent::get_rua;
use std::str;
use rs_torrent_magnet::magnet_from_torrent;

use crate::app_modules::database::Database;

pub struct ProviderXatab {
    service: Arc<Mutex<TorrentService>>,
    client: Client,
    total_pages: u32,
    processed_pages: u32,
    max_page_in_queue: u32,
}

impl ProviderXatab {
    pub fn new(service: Arc<Mutex<TorrentService>>) -> Self {
        ProviderXatab {
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
                self.collect_pages(self.total_pages).await;
                Ok(())
            }
            Err(e) => {
                println!("Error getting total pages: {}", e);
                Ok(()) // Продолжаем выполнение даже при ошибке
            }
        }
    }

    async fn get_total_pages(&self) -> Result<u32, String> {
        let url = "https://byxatab.com/page/1";
        let text = self.fetch_web_content(url).await?;
        let document = Html::parse_document(&text);
        let selector = Selector::parse("#bottom-nav > div.pagination > a:last-child").unwrap();

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
                    let mut provider = ProviderXatab {
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
        let url = format!("https://byxatab.com/page/{}", page);
        match self.fetch_web_content(&url).await {
            Ok(data) => {
                if data.len() < 100 {
                    return Ok(());
                }

                let document = Html::parse_document(&data);
                let title_selector = Selector::parse(".entry__title a").unwrap();

                for element in document.select(&title_selector) {
                    let title = element.text().collect::<Vec<_>>().join("");
                    let formatted_title = format_name(xatab_formatter(title));
                    let link = match element.value().attr("href") {
                        Some(url) => url.to_string(),
                        None => continue,
                    };

                    let torrent = Torrent {
                        id: "".to_string(),
                        name: formatted_title,
                        repacker: "Xatab".to_string(),
                        torrent: link,
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
        let data = self.fetch_web_content(url).await?;
        let (updated, download_url) = self.parse_torrent_info(&data)?;
        let buffer = self.fetch_file_buffer(download_url).await?;
        match self.extract_magnet_link(buffer) {
            Ok(magnet) => Ok((updated, magnet)),
            Err(e) => {
                println!("Error extracting magnet link: {}", e);
                Err(e)
            }
        }
    }

    fn parse_torrent_info(&self, data: &str) -> Result<(String, String), String> {
        let document = Html::parse_document(data);
        let date_selector = Selector::parse(".entry__date").unwrap();
        let magnet_selector = Selector::parse(".download-torrent").unwrap();

        let updated = document.select(&date_selector)
            .next()
            .map(|element| element.text().collect::<Vec<_>>().join(""))
            .unwrap_or_else(|| "Unknown".to_string());

        let download_url = document.select(&magnet_selector)
            .next()
            .map(|element| element.value().attr("href").unwrap().to_string())
            .unwrap_or_else(|| "No download link found".to_string());

        Ok((updated, download_url))
    }

    fn extract_magnet_link(&self, buffer: Vec<u8>) -> Result<String, String> {
        let magnet_link = magnet_from_torrent(buffer);
        Ok(magnet_link)
    }

    async fn fetch_file_buffer(&self, url: String) -> Result<Vec<u8>, String> {
        let client = reqwest::Client::new();
        let response = client.get(&url).send().await;

        match response {
            Ok(res) => {
                if res.status().is_success() {
                    match res.bytes().await {
                        Ok(bytes) => Ok(bytes.to_vec()),
                        Err(e) => Err(format!("Failed to read response data: {}", e))
                    }
                } else {
                    Err(format!("HTTP error: {}", res.status()))
                }
            },
            Err(e) => Err(format!("Failed to fetch URL: {}", e)),
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
pub async fn get_torrent_info_xatab(url: String, window: Window) -> Result<(String, String), String> {
    let db = Arc::new(Mutex::new(Database::new().unwrap()));
    let torrent_service = Arc::new(Mutex::new(TorrentService::new(db.clone())));
    
    let provider = ProviderXatab::new(torrent_service);
    provider.get_torrent_info(&url).await
}
