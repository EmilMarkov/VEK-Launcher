use crate::app_modules::torrent_service::TorrentService;
use crate::app_modules::database::Torrent;
use reqwest::Client;
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::app_modules::formatters::gog_formatter;
use crate::app_modules::helpers::format_name;

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

    async fn fetch_web_content(&self, url: &str) -> Result<String, String> {
        self.client
            .get(url)
            .send()
            .await
            .map_err(|e| format!("Ошибка HTTP запроса: {}", e))?
            .text()
            .await
            .map_err(|e| format!("Ошибка чтения текста ответа: {}", e))
    }
}
