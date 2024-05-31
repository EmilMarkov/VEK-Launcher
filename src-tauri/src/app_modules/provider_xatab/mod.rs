use crate::app_modules::torrent_service::TorrentService;
use crate::app_modules::database::Torrent;
use reqwest::Client;
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};
use crate::app_modules::formatters::xatab_formatter;
use crate::app_modules::helpers::format_name;

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
        self.total_pages = self.get_total_pages().await?;
        self.collect_pages(self.total_pages);
        Ok(())
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

    fn collect_pages(&mut self, up_to_page: u32) {
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
                    provider.process_page(page).await;
                });
            }
        });
    }

    async fn process_page(&mut self, page: u32) {
        let url = format!("https://byxatab.com/page/{}", page);
        match self.fetch_web_content(&url).await {
            Ok(data) => {
                if data.len() < 100 {
                    return;
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
            }
            Err(error) => {
                println!("Ошибка при обработке страницы {}: {}", page, error);
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
