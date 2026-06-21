use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AllNoteInput {
    id: String,
    updated_at: String,
}

#[tauri::command]
pub fn list_all_notes(mut input: Vec<AllNoteInput>) -> Vec<String> {
    input.sort_by(|first, second| second.updated_at.cmp(&first.updated_at));
    input.into_iter().map(|note| note.id).collect()
}
