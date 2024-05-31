use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};
use rusqlite::Error;
use uuid::Uuid;
use std::path::{PathBuf};
use std::fs;
use dirs;

#[derive(Debug)]
pub struct Database {
    connection: Connection,
}

impl Database {
    pub fn new() -> Result<Self, Error> {
        let db_path = Self::get_database_path()?;
        match Connection::open(&db_path) {
            Ok(connection) => {
                match connection.execute(
                    "CREATE TABLE IF NOT EXISTS torrents (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    repacker TEXT,
                    torrent TEXT
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

    pub fn add_torrent(
        &self,
        name: &str,
        repacker: &str,
        torrent: &str,
    ) -> Result<(), Error> {
        if self.is_duplicate(name, repacker, torrent)? {
            // Если дубль, просто выходим без добавления
            return Ok(());
        }

        let id = Uuid::new_v4().to_string();
        self.connection.execute(
            "INSERT INTO torrents (id, name, repacker, torrent) VALUES (?1, ?2, ?3, ?4)",
            params![&id, name, repacker, torrent],
        )?;
        Ok(())
    }

    fn is_duplicate(&self, name: &str, repacker: &str, torrent: &str) -> Result<bool, Error> {
        let mut statement = self.connection.prepare(
            "SELECT EXISTS(SELECT 1 FROM torrents WHERE name = ?1 AND repacker = ?2 AND torrent = ?3)"
        )?;
        let exists: bool = statement.query_row(params![name, repacker, torrent], |row| row.get(0))?;
        Ok(exists)
    }

    pub fn get_torrent_by_id(&self, id: &str) -> Result<Option<Torrent>> {
        let mut statement = self.connection.prepare("SELECT * FROM torrents WHERE id = ?1")?;
        let mut rows = statement.query(params![id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(Torrent {
                id: row.get(0)?,
                name: row.get(1)?,
                repacker: row.get(2)?,
                torrent: row.get(3)?,
            }))
        } else {
            Ok(None)
        }
    }

    pub fn get_all_torrents(&self) -> Result<Vec<Torrent>> {
        let mut statement = self.connection.prepare("SELECT * FROM torrents")?;
        let rows = statement.query_map([], |row| {
            Ok(Torrent {
                id: row.get(0)?,
                name: row.get(1)?,
                repacker: row.get(2)?,
                torrent: row.get(3)?,
            })
        })?;
        rows.collect()
    }

    pub fn update_torrent(&self, torrent: &Torrent) -> Result<()> {
        self.connection.execute(
            "UPDATE torrents SET name = ?1, repacker = ?2 torrent = ?3 WHERE id = ?4",
            params![torrent.name, torrent.repacker, torrent.torrent, torrent.id],
        )?;
        Ok(())
    }

    pub fn delete_torrent(&self, id: &str) -> Result<()> {
        self.connection.execute("DELETE FROM torrents WHERE id = ?1", params![id])?;
        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
pub struct Torrent {
    pub id: String,
    pub name: String,
    pub repacker: String,
    pub torrent: String,
}
