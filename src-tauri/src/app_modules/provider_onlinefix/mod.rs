use crate::app_modules::torrent_service::TorrentService;
use crate::app_modules::database::Torrent;
use reqwest::{Client, header::HeaderValue};
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};
use crate::app_modules::formatters::onlinefix_formatter;
use crate::app_modules::helpers::format_name;
use fake_user_agent::get_rua;
use reqwest_cookie_store::{CookieStore, CookieStoreMutex};
use rs_torrent_magnet::magnet_from_torrent;
use serde_json::Value;
use dotenv::dotenv;
use std::env;

pub struct ProviderOnlineFix {
    service: Arc<Mutex<TorrentService>>,
    client: Client,
    cookie_store: Arc<CookieStoreMutex>,
    total_pages: u32,
    processed_pages: u32,
    max_page_in_queue: u32,
}

impl ProviderOnlineFix {
    pub fn new(service: Arc<Mutex<TorrentService>>) -> Self {
        let cookie_store = Arc::new(CookieStoreMutex::new(CookieStore::default()));
        let client = Client::builder()
            .cookie_provider(cookie_store.clone())
            .build()
            .unwrap();

        ProviderOnlineFix {
            service,
            client,
            cookie_store,
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

    pub async fn authenticate(&self) -> Result<(), String> {
        dotenv().ok();

        let pre_login_url = "https://online-fix.me/engine/ajax/authtoken.php";
        let login_url = "https://online-fix.me/";
        let username = env::var("ONLINEFIX_USERNAME").expect("USERNAME not set in .env file");
        let password = env::var("ONLINEFIX_PASSWORD").expect("PASSWORD not set in .env file");
        let user_agent = get_rua();

        let pre_login_res = self.client
            .get(pre_login_url)
            .header("X-Requested-With", "XMLHttpRequest")
            .header("Referer", login_url)
            .header("User-Agent", HeaderValue::from_str(&user_agent).unwrap())
            .send()
            .await
            .map_err(|e| format!("Failed to get auth token: {}", e))?
            .json::<Value>()
            .await
            .map_err(|e| format!("Failed to parse auth token response: {}", e))?;

        let field = pre_login_res["field"].as_str().ok_or("No field in auth token")?;
        let value = pre_login_res["value"].as_str().ok_or("No value in auth token")?;

        let mut params = vec![
            ("login_name", username),
            ("login_password", password),
            ("login", "submit".to_string()),
        ];
        params.push((field, value.to_string()));

        self.client
            .post(login_url)
            .header("Referer", login_url)
            .header("Origin", login_url)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("User-Agent", HeaderValue::from_str(&user_agent).unwrap())
            .form(&params)
            .send()
            .await
            .map_err(|e| format!("Failed to authenticate: {}", e))?;

        Ok(())
    }

    async fn get_total_pages(&self) -> Result<u32, String> {
        let url = "https://online-fix.me/page/1";
        let text = self.fetch_web_content(url, "https://online-fix.me/").await?;
        let document = Html::parse_document(&text);
        let selector = Selector::parse("nav.pagination.hide_onajax a:nth-last-of-type(2)").unwrap();

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
                    let mut provider = ProviderOnlineFix {
                        service: service_clone,
                        client: client_clone,
                        cookie_store: Arc::new(CookieStoreMutex::new(CookieStore::default())),
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
        let url = format!("https://online-fix.me/page/{}", page);
        match self.fetch_web_content(&url, "https://online-fix.me/").await {
            Ok(data) => {
                if data.len() < 100 {
                    return;
                }

                let document = Html::parse_document(&data);
                let link_selector = Selector::parse("article.news > .article.clr > .article-content > a").unwrap();
                let title_selector = Selector::parse("h2.title").unwrap();

                for element in document.select(&link_selector) {
                    let title_element = element.select(&title_selector).next();
                    let title = title_element.map(|e| e.text().collect::<Vec<_>>().join("")).unwrap_or_default();
                    let formatted_title = format_name(onlinefix_formatter(title));
                    let link = match element.value().attr("href") {
                        Some(url) => url.to_string(),
                        None => continue,
                    };

                    let torrent = Torrent {
                        id: "".to_string(),
                        name: formatted_title,
                        repacker: "Online-Fix".to_string(),
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

    pub async fn get_torrent_info(&self, url: &str) -> Result<(String, String), String> {
        let data = self.fetch_web_content(url, "https://online-fix.me/").await?;
    
        let (updated, torrent_directory_url) = self.parse_torrent_info(&data)?;
    
        let final_torrent_url = self.get_torrent_file_url(&torrent_directory_url).await?;

        let buffer = self.fetch_file_buffer(final_torrent_url, &torrent_directory_url).await?;
    
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
        let date_selector = Selector::parse(".date.left > time").unwrap();
        let torrent_page_selector = Selector::parse("div.quote a[href*='torrents']").unwrap();
    
        let updated = document.select(&date_selector)
            .next()
            .map(|element| element.text().collect::<Vec<_>>().join(""))
            .unwrap_or_else(|| "Unknown".to_string());
    
        let torrent_page_url = document.select(&torrent_page_selector)
            .next()
            .map(|e| e.value().attr("href").unwrap().to_string())
            .ok_or("No torrent page link found")?;
    
        Ok((updated, torrent_page_url))
    }

    async fn get_torrent_file_url(&self, directory_url: &str) -> Result<String, String> {
        let data = self.fetch_web_content(directory_url, "https://online-fix.me/").await?;
        let document = Html::parse_document(&data);
        let file_selector = Selector::parse("pre a[href$='.torrent']").unwrap();
    
        let file_url = document.select(&file_selector)
            .next()
            .map(|element| element.value().attr("href").unwrap().to_string())
            .ok_or("No torrent file link found")?;
    
        let full_url = format!("{}/{}", directory_url.trim_end_matches('/'), file_url);
        Ok(full_url)
    }

    fn extract_magnet_link(&self, buffer: Vec<u8>) -> Result<String, String> {
        let magnet_link = magnet_from_torrent(buffer);
        Ok(magnet_link)
    }

    async fn fetch_file_buffer(&self, url: String, referer: &str) -> Result<Vec<u8>, String> {
        let user_agent = get_rua();
    
        let response = self.client
            .get(&url)
            .header("User-Agent", HeaderValue::from_str(&user_agent).unwrap())
            .header("Referer", HeaderValue::from_str(referer).unwrap())
            .send()
            .await;
    
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
            Err(e) => Err(format!("Failed to fetch URL: {}", e))
        }
    }    

    async fn fetch_web_content(&self, url: &str, referer: &str) -> Result<String, String> {
        let user_agent = get_rua();

        self.client
            .get(url)
            .header("User-Agent", HeaderValue::from_str(&user_agent).unwrap())
            .header("Referer", HeaderValue::from_str(referer).unwrap())
            .send()
            .await
            .map_err(|e| format!("Ошибка HTTP запроса: {}", e))?
            .text()
            .await
            .map_err(|e| format!("Ошибка чтения текста ответа: {}", e))
    }

    fn debug_cookies(&self) -> Vec<(String, String)> {
        let store = self.cookie_store.lock().unwrap();
        let mut cookies = Vec::new();
        for cookie in store.iter_any() {
            cookies.push((cookie.name().to_string(), cookie.value().to_string()));
        }
        cookies
    }
}
