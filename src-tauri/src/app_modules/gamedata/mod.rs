use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
pub struct GameInfo {
    pub id: i32,
    pub slug: String,
    pub name: String,
    pub name_original: String,
    pub description: String,
    pub metacritic: i32,
    pub metacritic_platforms: Vec<MetacriticPlatform>,
    pub released: String,
    pub tba: bool,
    pub updated: String,
    pub background_image: String,
    pub background_image_additional: String,
    pub website: String,
    pub rating: f64,
    pub rating_top: i32,
    pub ratings: Vec<Rating>,
    pub reactions: HashMap<String, i32>,
    pub added: i32,
    pub added_by_status: AddedByStatus,
    pub playtime: i32,
    pub screenshots_count: i32,
    pub movies_count: i32,
    pub creators_count: i32,
    pub achievements_count: i32,
    pub parent_achievements_count: i32,
    pub alternative_names: Vec<String>,
    pub metacritic_url: String,
    pub parents_count: i32,
    pub additions_count: i32,
    pub game_series_count: i32,
    pub description_raw: String,
    pub parent_platforms: Vec<ParentPlatform>,
    pub platforms: Vec<Platform>,
    pub stores: Vec<Store>,
    pub developers: Vec<Developer>,
    pub genres: Vec<Genre>,
    pub tags: Vec<Tag>,
    pub publishers: Vec<Publisher>,
    pub esrb_rating: EsrbRating,
    pub clip: Clip,
}

#[derive(Serialize, Deserialize)]
pub struct MetacriticPlatform {
    pub metascore: i32,
    pub url: String,
    pub platform: PlatformInfo,
}

#[derive(Serialize, Deserialize)]
pub struct Rating {
    pub id: i32,
    pub title: String,
    pub count: i32,
    pub percent: f64,
}

#[derive(Serialize, Deserialize)]
pub struct AddedByStatus {
    pub yet: i32,
    pub owned: i32,
    pub beaten: i32,
    pub toplay: i32,
    pub dropped: i32,
    pub playing: i32,
}

#[derive(Serialize, Deserialize)]
pub struct ParentPlatform {
    pub platform: PlatformInfo,
}

#[derive(Serialize, Deserialize)]
pub struct Platform {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub games_count: i32,
    pub image_background: String,
}

#[derive(Serialize, Deserialize)]
pub struct Store {
    pub id: i32,
    pub url: String,
    pub store: StoreInfo,
}

#[derive(Serialize, Deserialize)]
pub struct Developer {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub games_count: i32,
    pub image_background: String,
}

#[derive(Serialize, Deserialize)]
pub struct Genre {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub games_count: i32,
    pub image_background: String,
}

#[derive(Serialize, Deserialize)]
pub struct Tag {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub games_count: i32,
    pub image_background: String,
}

#[derive(Serialize, Deserialize)]
pub struct Publisher {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub games_count: i32,
    pub image_background: String,
}

#[derive(Serialize, Deserialize)]
pub struct EsrbRating {
    pub id: i32,
    pub name: String,
    pub slug: String,
}

#[derive(Serialize, Deserialize)]
pub struct Clip {
    pub clip: String,
    pub clips: HashMap<String, String>,
    pub video: String,
    pub preview: String,
}

#[derive(Serialize, Deserialize)]
pub struct PlatformInfo {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub games_count: i32,
    pub image_background: String,
}

#[derive(Serialize, Deserialize)]
pub struct StoreInfo {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub domain: String,
    pub games_count: i32,
    pub image_background: String,
}
