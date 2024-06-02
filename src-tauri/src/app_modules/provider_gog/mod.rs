use crate::app_modules::torrent_service::TorrentService;
use crate::app_modules::database::Torrent;
use reqwest::Client;
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::app_modules::formatters::gog_formatter;
use crate::app_modules::helpers::format_name;
use fake_user_agent::get_rua;
use base64::engine::general_purpose;
use base64::Engine as _;
use std::str;

pub struct ProviderGOG {
    service: Arc<Mutex<TorrentService>>,
    client: Client,
}

impl ProviderGOG {
    pub fn new(service: Arc<Mutex<TorrentService>>) -> Self {
        ProviderGOG {
            service,
            client: Client::new(),
        }
    }

    pub async fn init_scraping(&self) -> Result<(), String> {
        self.process_page().await?;
        Ok(())
    }

    async fn process_page(&self) -> Result<(), String> {
        let url = "https://freegogpcgames.com/a-z-games-list/";
        match self.fetch_web_content(url).await {
            Ok(data) => {
                if data.len() < 100 {
                    return Ok(());
                }

                let document = Html::parse_document(&data);
                let title_selector = Selector::parse(".items-inner > .letter-section > .az-columns > li > a").unwrap();

                for element in document.select(&title_selector) {
                    let title = element.text().collect::<Vec<_>>().join("");
                    let formatted_title = format_name(gog_formatter(title));
                    let link = match element.value().attr("href") {
                        Some(url) => url.to_string(),
                        None => continue,
                    };

                    let torrent = Torrent {
                        id: "".to_string(),
                        name: formatted_title,
                        repacker: "GOG".to_string(),
                        torrent: link,
                    };

                    let service = self.service.clone();
                    tokio::spawn(async move {
                        if let Err(e) = service.lock().await.add_torrent(torrent).await {
                            println!("Ошибка при добавлении торрента: {}", e);
                        }
                    });
                }

                Ok(())
            }
            Err(error) => {
                println!("Ошибка при обработке страницы: {}", error);
                Err(error)
            }
        }
    }

    pub async fn get_torrent_info(&self, url: &str) -> Result<(String, String), String> {
        match self.fetch_web_content(url).await {
            Ok(data) => {
                let document = Html::parse_document(&data);
                let date_selector = Selector::parse("[property=\"article:modified_time\"]").unwrap();
                let magnet_selector = Selector::parse(".download-btn:not(.lightweight-accordion *)").unwrap();

                let updated = document.select(&date_selector)
                    .next()
                    .map(|element| element.text().collect::<Vec<_>>().join(""))
                    .unwrap_or_else(|| "Unknown".to_string());

                let magnet_link = document.select(&magnet_selector)
                    .next()
                    .and_then(|element| element.value().attr("href"))
                    .unwrap_or_else(|| "No magnet link found");

                let magnet = if let Some(start) = magnet_link.find("url=") {
                    let encoded = &magnet_link[start + 4..];
                    match general_purpose::STANDARD.decode(encoded) {
                        Ok(bytes) => match str::from_utf8(&bytes) {
                            Ok(decoded) => decoded.to_string(),
                            Err(_) => "Invalid UTF-8 sequence".to_string(),
                        },
                        Err(_) => "Failed to decode Base64".to_string(),
                    }
                } else {
                    "No magnet link found".to_string()
                };

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
