use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandRecord {
    id: String,
    command: String,
    note_id: String,
    collection_id: String,
    note_title: String,
    step_title: String,
    updated_at: String,
}

#[tauri::command]
pub fn list_commands(mut input: Vec<CommandRecord>) -> Vec<CommandRecord> {
    input.sort_by(|first, second| second.updated_at.cmp(&first.updated_at));
    input
}
