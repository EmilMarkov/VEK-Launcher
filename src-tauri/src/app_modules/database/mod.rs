use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};
use rusqlite::Error;
use uuid::Uuid;

pub struct Database {
    connection: Connection,
}

impl Database {
    pub fn new() -> Result<Self, Error> {
        match Connection::open("./games.db") {
            Ok(connection) => {
                match connection.execute(
                    "CREATE TABLE IF NOT EXISTS games (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT,
                    screenshots TEXT,
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

    pub fn add_game(
        &self,
        title: &str,
        description: Option<&str>,
        screenshots: Option<&[String]>,
        torrents: Option<&[String]>,
    ) -> Result<(), Error> {
        let id = Uuid::new_v4().to_string();
        let screenshots_str = screenshots.map(|s| s.join(","));
        let torrents_str = torrents.map(|t| t.join(","));
        self.connection.execute(
            "INSERT INTO games (id, title, description, screenshots, torrents) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![&id, title, description, screenshots_str, torrents_str],
        )?;
        Ok(())
    }

    pub fn get_game_by_id(&self, id: &str) -> Result<Option<Game>> {
        let mut statement = self.connection.prepare("SELECT * FROM games WHERE id = ?1")?;
        let mut rows = statement.query(params![id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(Game {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                screenshots: row.get::<_, Option<String>>(3)?.map(|s| s.split(',').map(String::from).collect()),
                torrents: row.get::<_, Option<String>>(4)?.map(|t| t.split(',').map(String::from).collect()),
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
                title: row.get(1)?,
                description: row.get(2)?,
                screenshots: row.get::<_, Option<String>>(3)?.map(|s| s.split(',').map(String::from).collect()),
                torrents: row.get::<_, Option<String>>(4)?.map(|t| t.split(',').map(String::from).collect()),
            })
        })?;
        rows.collect()
    }

    pub fn update_game(&self, game: &Game) -> Result<()> {
        let screenshots_str = game.screenshots.as_ref().map(|s| s.join(","));
        let torrents_str = game.torrents.as_ref().map(|t| t.join(","));
        self.connection.execute(
            "UPDATE games SET title = ?1, description = ?2, screenshots = ?3, torrents = ?4 WHERE id = ?5",
            params![game.title, game.description, screenshots_str, torrents_str, game.id],
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
    pub title: String,
    pub description: Option<String>,
    pub screenshots: Option<Vec<String>>,
    pub torrents: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
pub struct GameInput {
    pub title: String,
    pub description: Option<String>,
    pub screenshots: Option<Vec<String>>,
    pub torrents: Option<Vec<String>>,
}
