use reqwest;
use serde_json::Value;
use std::error::Error;
use std::fmt;
use regex::Regex;
use fake_user_agent::get_rua;
use reqwest::{Client, StatusCode};

const BASE_URL: &str = "https://api.rawg.io/api/";
const PAGE_SIZE: usize = 10;
const PLAY_ON_DESKTOP: bool = true;

#[derive(Debug)]
pub enum ApiError {
    NotFound(String),
    ClientError(String),
    ServerError(String),
    UnexpectedStatusCode(String),
    JsonError(String),
    HttpRequestError(reqwest::Error),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            ApiError::NotFound(ref message) => write!(f, "Not Found: {}", message),
            ApiError::ClientError(ref message) => write!(f, "Client Error: {}", message),
            ApiError::ServerError(ref message) => write!(f, "Server Error: {}", message),
            ApiError::UnexpectedStatusCode(ref message) => write!(f, "Unexpected Status Code: {}", message),
            ApiError::JsonError(ref message) => write!(f, "JSON Parsing Error: {}", message),
            ApiError::HttpRequestError(ref err) => err.fmt(f),
        }
    }
}

impl Error for ApiError {}

impl From<reqwest::Error> for ApiError {
    fn from(err: reqwest::Error) -> Self {
        ApiError::HttpRequestError(err)
    }
}

async fn get(url: &str, retry: bool) -> Result<Value, Box<dyn Error>> {
    let user_agent = get_rua();
    let client = Client::builder()
        .user_agent(user_agent.clone())
        .build()
        .map_err(ApiError::from)?;

    let resp = client.get(url)
        .header("X-Api-Client", "website")
        .send()
        .await
        .map_err(ApiError::from)?;
    let status = resp.status();
    let body = resp.text().await.map_err(ApiError::from)?;

    match status {
        StatusCode::OK => {
            serde_json::from_str::<Value>(&body).map_err(|e| Box::new(ApiError::JsonError(format!("Failed to parse JSON: {}", e))) as Box<dyn Error>)
        },
        StatusCode::UNAUTHORIZED => {
            if retry {
                let new_user_agent = get_rua();
                let new_client = Client::builder()
                    .user_agent(new_user_agent)
                    .build()
                    .map_err(ApiError::from)?;
                let new_resp = new_client.get(url)
                    .header("X-Api-Client", "website")
                    .send()
                    .await
                    .map_err(ApiError::from)?;
                let new_status = new_resp.status();
                let new_body = new_resp.text().await.map_err(ApiError::from)?;
                if new_status == StatusCode::OK {
                    return serde_json::from_str::<Value>(&new_body)
                        .map_err(|e| Box::new(ApiError::JsonError(format!("Failed to parse JSON: {}", e))) as Box<dyn Error>);
                }
            }
            Err(Box::new(ApiError::ClientError(format!("Client Error: {}. Response body: {}", status, body))))
        },
        StatusCode::NOT_FOUND => Err(Box::new(ApiError::NotFound(format!("API Error: Not found. Response body: {}", body)))),
        status if status.is_client_error() => Err(Box::new(ApiError::ClientError(format!("Client Error: {}. Response body: {}", status, body)))),
        status if status.is_server_error() => Err(Box::new(ApiError::ServerError(format!("Server Error: {}. Response body: {}", status, body)))),
        _ => Err(Box::new(ApiError::UnexpectedStatusCode(format!("Unexpected status code: {}. Response body: {}", status, body)))),
    }
}

pub async fn update_api_key() -> Result<String, Box<dyn Error>> {
    let url = "https://rawg.io/";
    let resp = reqwest::get(url).await?;
    let body = resp.text().await?;

    let re = Regex::new(r#""rawgApiKey":"([a-zA-Z0-9]+)""#)?;
    if let Some(caps) = re.captures(&body) {
        if let Some(api_key) = caps.get(1) {
            return Ok(api_key.as_str().to_string());
        }
    }

    Err("API Key not found".into())
}

#[tauri::command]
pub async fn get_game_list(api_key: &str, page: Option<usize>, next: Option<&str>) -> Result<Option<Value>, String> {
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!(
            "{}games?key={}&page={}&page_size={}&play_on_desktop={}",
            BASE_URL, api_key, page.unwrap_or(1), PAGE_SIZE, PLAY_ON_DESKTOP
        )
    };

    let response = get(&url, true).await.map_err(|e| e.to_string())?;
    Ok(Some(response))
}

#[tauri::command]
pub async fn search_game(api_key: &str, query: &str, next: Option<&str>) -> Result<Option<Value>, String> {
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!(
            "{}games?platforms=4&exclude_additions=true&exclude_stores=true&exclude_collection=true&search_exact=true&search={}&key={}&ordering=-rating",
            BASE_URL, query, api_key
        )
    };

    let response = get(&url, true).await.map_err(|e| e.to_string())?;
    Ok(Some(response))
}

#[tauri::command]
pub async fn get_game_details(api_key: &str, id: i32) -> Result<Option<Value>, String> {
    let url = format!("{}games/{}?key={}", BASE_URL, id, api_key);

    let response = get(&url, true).await.map_err(|e| e.to_string())?;
    Ok(Some(response))
}

#[tauri::command]
pub async fn get_game_screenshots(api_key: &str, id: i32, page: Option<usize>, next: Option<&str>) -> Result<Option<Value>, String> {
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!(
            "{}games/{}/screenshots?key={}&page={}",
            BASE_URL, id, api_key, page.unwrap_or(1)
        )
    };

    let response = get(&url, true).await.map_err(|e| e.to_string())?;
    Ok(Some(response))
}

#[tauri::command]
pub async fn get_game_movies(api_key: &str, id: i32, next: Option<&str>) -> Result<Option<Value>, String> {
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!("{}games/{}/movies?key={}", BASE_URL, id, api_key)
    };

    let response = get(&url, true).await.map_err(|e| e.to_string())?;
    Ok(Some(response))
}
