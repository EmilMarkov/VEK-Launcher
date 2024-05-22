#![allow(non_snake_case)]

use std::fs;
use std::path::Path;
use std::time::SystemTime;

#[derive(serde::Serialize)]
pub struct FileMetaDataResponse {
  filePath: String,
  basename: String,
  fileType: String,
  isDir: bool,
  isHidden: bool,
  isFile: bool,
  isSystem: bool,
  size: u64,
  readonly: bool,
  lastModified: SystemTime,
  lastAccessed: SystemTime,
  created: SystemTime,
  isTrash: bool,
}

fn get_basename(file_path: String) -> String {
  let basename = Path::new(&file_path).file_name();
  match basename {
    Some(basename) => basename.to_str().unwrap().to_string(),
    None => file_path,
  }
}

fn check_is_hidden(file_path: String) -> bool {
  let basename = get_basename(file_path);
  basename.clone().starts_with(".")
}

#[tauri::command]
pub fn fetch_file(file_path: String) -> Result<FileMetaDataResponse, String> {
  let metadata = fs::metadata(file_path.clone());
  let metadata = match metadata {
    Ok(result) => result,
    Err(e) => return Err(e.to_string()),
  };
  let is_dir = metadata.is_dir();
  let is_file = metadata.is_file();
  let size = metadata.len();
  let readonly = metadata.permissions().readonly();
  let last_modified = metadata.modified();
  let last_modified = match last_modified {
    Ok(result) => result,
    Err(e) => return Err(e.to_string()),
  };
  let last_accessed = metadata.accessed();
  let last_accessed = match last_accessed {
    Ok(result) => result,
    Err(e) => return Err(e.to_string()),
  };
  let created = metadata.created();
  let created = match created {
    Ok(result) => result,
    Err(e) => return Err(e.to_string()),
  };
  let basename = get_basename(file_path.clone());
  let is_hidden = check_is_hidden(file_path.clone());
  let is_system = false;
  let file_type = "test".to_string();
  Ok(FileMetaDataResponse {
    isSystem: is_system,
    isHidden: is_hidden,
    isDir: is_dir,
    isFile: is_file,
    size,
    readonly,
    lastModified: last_modified,
    lastAccessed: last_accessed,
    created,
    filePath: file_path,
    fileType: file_type,
    basename,
    isTrash: false,
  })
}