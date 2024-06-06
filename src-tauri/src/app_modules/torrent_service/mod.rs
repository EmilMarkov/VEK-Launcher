use crate::app_modules::database::{Database, Torrent};
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct TorrentService {
    db: Arc<Mutex<Database>>,
}

impl TorrentService {
    pub fn new(db: Arc<Mutex<Database>>) -> Self {
        TorrentService { db }
    }

    pub async fn add_torrent(&self, torrent: Torrent) -> Result<(), String> {
        let db = self.db.lock().await;
        db.add_torrent(&torrent.name, &torrent.repacker, &torrent.torrent)
            .map_err(|e| format!("Failed to add torrent: {}", e))
    }

    pub async fn get_torrent_by_id(&self, id: &str) -> Result<Option<Torrent>, String> {
        let db = self.db.lock().await;
        db.get_torrent_by_id(id)
            .map_err(|e| format!("Failed to get torrent: {}", e))
    }

    pub async fn update_torrent(&self, torrent: Torrent) -> Result<(), String> {
        let db = self.db.lock().await;
        db.update_torrent(&torrent)
            .map_err(|e| format!("Failed to update torrent: {}", e))
    }

    pub async fn delete_torrent(&self, id: &str) -> Result<(), String> {
        let db = self.db.lock().await;
        db.delete_torrent(id)
            .map_err(|e| format!("Failed to delete torrent: {}", e))
    }

    pub async fn get_all_torrents(&self) -> Result<Vec<Torrent>, String> {
        let db = self.db.lock().await;
        db.get_all_torrents()
            .map_err(|e| format!("Failed to get all torrents: {}", e))
    }
}
