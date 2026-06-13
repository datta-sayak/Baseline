use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub is_dir: bool,
    pub has_children: bool,
    pub children: Option<Vec<FileNode>>,
}

fn check_children(path: &str) -> bool {
    if let Ok(entries) = fs::read_dir(path) {
        for _ in entries.flatten() {
            return true;
        }
        return false;
    } else {
        return false;
    }
}


#[tauri::command]
pub fn read_child_dir(path: String) -> Result<Vec<FileNode>, String> {
    let dir_path: &Path = Path::new(&path);
    if !dir_path.is_dir() {
        return Err("Not a directory".to_string());
    }
    let mut entries: Vec<FileNode> = Vec::new();

    if let Ok(dir_entries) = fs::read_dir(dir_path) {
        for entry in dir_entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                let file_name: String = entry
                    .file_name()
                    .to_string_lossy()
                    .to_string();

                let path: String = entry.path().to_string_lossy().to_string();
                let is_dir: bool = metadata.is_dir();
                let size: u64 = metadata.len();
                let has_children: bool = if is_dir {
                    check_children(&path)
                } else {
                    false
                };

                entries.push(FileNode {
                    name: file_name,
                    path,
                    size,
                    is_dir,
                    has_children,
                    children: None,
                });
            }
        }
    } else {
        return Err("Failed to read the child directory".to_string());
    }

  Ok(entries)
}


#[tauri::command]
pub fn read_root_dir(path: String) -> Result<FileNode, String> {
    let dir_path: &Path = Path::new(&path);
    if !dir_path.is_dir() {
        return Err("Not a directory".to_string());
    }

    let name: String = path
        .split('/')
        .last()
        .unwrap_or("root")
        .to_string();

    let mut root: FileNode = FileNode {
        name,
        path: path.clone(),
        size: 0,
        is_dir: true,
        has_children: true,
        children: None,
    };

    let mut children: Vec<FileNode> = Vec::new();

    if let Ok(dir_entries) = fs::read_dir(&path) {
        for entry in dir_entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                let file_name: String = entry
                    .file_name()
                    .to_string_lossy()
                    .to_string();

                let entry_path: String = entry
                    .path()
                    .to_string_lossy()
                    .to_string();

                let is_dir: bool = metadata.is_dir();
                let size: u64 = metadata.len();
                let has_children: bool = if is_dir {
                    check_children(&entry_path)
                } else {
                    false
                };

                children.push(FileNode {
                    name: file_name,
                    path: entry_path,
                    size,
                    is_dir,
                    has_children,
                    children: None,
                });
            }
        }

        root.has_children = !children.is_empty();
        root.children = Some(children);
    } else {
        return Err("Failed to read the parent directory".to_string());
    }

    Ok(root)
}


#[tauri::command]
pub fn load_folder(path: String) -> Result<Vec<FileNode>, String> {
    read_child_dir(path)
}


#[tauri::command]
pub fn open_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}
