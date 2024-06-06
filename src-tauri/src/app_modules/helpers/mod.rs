use std::path::PathBuf;
use std::time::Duration;
use rusqlite::Error;
use rusqlite::Result;
use std::fs;

use crate::app_modules::formatters::{
    remove_release_year_from_name,
    remove_symbols_from_name,
    remove_special_edition_from_name,
    remove_duplicate_spaces,
    remove_trash,
};

pub fn pipe<T, F>(input: T, functions: Vec<F>) -> T
    where
        F: Fn(T) -> T,
{
    functions.into_iter().fold(input, |acc, func| func(acc))
}

pub fn format_name(name: String) -> String {
    let functions: Vec<fn(String) -> String> = vec![
        remove_trash,
        remove_release_year_from_name,
        remove_symbols_from_name,
        remove_special_edition_from_name,
        remove_duplicate_spaces,
    ];
    pipe(name, functions).trim().to_string()
}

pub fn get_database_path() -> Result<PathBuf, Error> {
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

pub fn is_database_old(path: &PathBuf, duration: Duration) -> bool {
    match fs::metadata(path) {
        Ok(metadata) => {
            if let Ok(modified) = metadata.modified() {
                if let Ok(elapsed) = modified.elapsed() {
                    return elapsed > duration;
                }
            }
        }
        Err(_) => return true,
    }
    false
}
