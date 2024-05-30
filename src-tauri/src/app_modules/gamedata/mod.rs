use reqwest;
use serde_json::Value;
use reqwest::StatusCode;
use std::error::Error;
use std::{env, fmt};
use tokio;


const BASE_URL: &str = "https://api.rawg.io/api/";
const PAGE_SIZE: usize = 200;
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

async fn get(url: &str) -> Result<Value, Box<dyn Error>> {
    let resp = reqwest::get(url).await.map_err(ApiError::from)?;
    let status = resp.status();
    let body = resp.text().await.map_err(ApiError::from)?;

    match status {
        StatusCode::OK => {
            serde_json::from_str::<Value>(&body).map_err(|e| Box::new(ApiError::JsonError(format!("Failed to parse JSON: {}", e))) as Box<dyn Error>)
        },
        StatusCode::NOT_FOUND => Err(Box::new(ApiError::NotFound(format!("API Error: Not found. Response body: {}", body)))),
        status if status.is_client_error() => Err(Box::new(ApiError::ClientError(format!("Client Error: {}. Response body: {}", status, body)))),
        status if status.is_server_error() => Err(Box::new(ApiError::ServerError(format!("Server Error: {}. Response body: {}", status, body)))),
        _ => Err(Box::new(ApiError::UnexpectedStatusCode(format!("Unexpected status code: {}. Response body: {}", status, body)))),
    }
}

pub async fn get_game_list(page: Option<usize>, next: Option<&str>) -> Result<Option<Value>, Box<dyn Error>> {
    let api_key = env::var("VEK_API_KEY").expect("VEK_API_KEY must be set");
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!(
            "{}games?key={}&page={}&page_size={}&play_on_desktop={}",
            BASE_URL, api_key, page.unwrap_or(1), PAGE_SIZE, PLAY_ON_DESKTOP
        )
    };

    let response = get(&url).await?;
    Ok(Some(response))
}

pub async fn search_game(query: &str, next: Option<&str>) -> Result<Option<Value>, Box<dyn Error>> {
    let api_key = env::var("VEK_API_KEY").expect("VEK_API_KEY must be set");
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!(
            "{}games?search={}&key={}&play_on_desktop={}",
            BASE_URL, query, api_key, PLAY_ON_DESKTOP
        )
    };

    let response = get(&url).await?;
    Ok(Some(response))
}

pub async fn get_game_detail(id: i32) -> Result<Option<Value>, Box<dyn Error>> {
    let api_key = env::var("VEK_API_KEY").expect("VEK_API_KEY must be set");
    let url = format!("{}games/{}?key={}", BASE_URL, id, api_key);

    let response = get(&url).await?;
    Ok(Some(response))
}

pub async fn get_game_screenshots(id: i32, page: Option<usize>, next: Option<&str>) -> Result<Option<Value>, Box<dyn Error>> {
    let api_key = env::var("VEK_API_KEY").expect("VEK_API_KEY must be set");
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!(
            "{}games/{}/screenshots?key={}&page={}",
            BASE_URL, id, api_key, page.unwrap_or(1)
        )
    };

    let response = get(&url).await?;
    Ok(Some(response))
}

pub async fn get_game_movies(id: i32, next: Option<&str>) -> Result<Option<Value>, Box<dyn Error>> {
    let api_key = env::var("VEK_API_KEY").expect("VEK_API_KEY must be set");
    let url = if let Some(next_url) = next {
        next_url.to_string()
    } else {
        format!("{}games/{}/movies?key={}", BASE_URL, id, api_key)
    };

    let response = get(&url).await?;
    Ok(Some(response))
}
