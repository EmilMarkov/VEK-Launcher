use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};
use rusqlite::Error;
use uuid::Uuid;
use std::path::{Path, PathBuf};
use std::fs;
use dirs;

pub struct Database {
    connection: Connection,
}

impl Database {
    pub fn new() -> Result<Self, Error> {
        let db_path = Self::get_database_path()?;
        match Connection::open(&db_path) {
            Ok(connection) => {
                match connection.execute(
                    "CREATE TABLE IF NOT EXISTS games (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    torrents TEXT
                )",
                    [],
                ) {
                    Ok(_) => Ok(Database { connection }),
                    Err(err) => Err(err.into()),
                }
            },
            Err(err) => Err(err.into()),
        }
    }

    fn get_database_path() -> Result<PathBuf, Error> {
        let mut path = dirs::data_local_dir().ok_or_else(|| {
            rusqlite::Error::InvalidPath("Could not determine local data directory".into())
        })?;

        path.push("VEKLauncher");
        if !path.exists() {
            fs::create_dir_all(&path).map_err(|e| {
                rusqlite::Error::InvalidPath(format!("Could not create directory: {}", e).into())
            })?;
        }

        path.push("veklauncher.db");
        Ok(path)
    }

    pub fn add_game(
        &self,
        name: &str,
        torrents: Option<&[String]>,
    ) -> Result<(), Error> {
        let id = Uuid::new_v4().to_string();
        let torrents_str = torrents.map(|t| t.join(","));
        self.connection.execute(
            "INSERT INTO games (id, name, torrents) VALUES (?1, ?2, ?3)",
            params![&id, name, torrents_str],
        )?;
        Ok(())
    }

    pub fn get_game_by_id(&self, id: &str) -> Result<Option<Game>> {
        let mut statement = self.connection.prepare("SELECT * FROM games WHERE id = ?1")?;
        let mut rows = statement.query(params![id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(Game {
                id: row.get(0)?,
                name: row.get(1)?,
                torrents: row.get::<_, Option<String>>(2)?.map(|t| t.split(',').map(String::from).collect()),
            }))
        } else {
            Ok(None)
        }
    }

    pub fn get_all_games(&self) -> Result<Vec<Game>> {
        let mut statement = self.connection.prepare("SELECT * FROM games")?;
        let rows = statement.query_map([], |row| {
            Ok(Game {
                id: row.get(0)?,
                name: row.get(1)?,
                torrents: row.get::<_, Option<String>>(2)?.map(|t| t.split(',').map(String::from).collect()),
            })
        })?;
        rows.collect()
    }

    pub fn update_game(&self, game: &Game) -> Result<()> {
        let torrents_str = game.torrents.as_ref().map(|t| t.join(","));
        self.connection.execute(
            "UPDATE games SET name = ?1, torrents = ?2 WHERE id = ?3",
            params![game.name, torrents_str, game.id],
        )?;
        Ok(())
    }

    pub fn add_torrent_to_game(&self, id: &str, torrent: &str) -> Result<()> {
        let game = self.get_game_by_id(id)?.ok_or(rusqlite::Error::QueryReturnedNoRows)?;
        let mut torrents = game.torrents.unwrap_or_default();
        torrents.push(torrent.to_string());
        self.update_game(&Game { torrents: Some(torrents), ..game })
    }

    pub fn delete_game(&self, id: &str) -> Result<()> {
        self.connection.execute("DELETE FROM games WHERE id = ?1", params![id])?;
        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
pub struct Game {
    pub id: String,
    pub name: String,
    pub torrents: Option<Vec<String>>,
}
