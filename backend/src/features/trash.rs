use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrashItemInput {
    id: String,
    deleted_at: String,
}

#[derive(Deserialize)]
pub struct TrashInput {
    collections: Vec<TrashItemInput>,
    notes: Vec<TrashItemInput>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TrashOrder {
    collection_ids: Vec<String>,
    note_ids: Vec<String>,
}

#[tauri::command]
pub fn list_trash(mut input: TrashInput) -> TrashOrder {
    input
        .collections
        .sort_by(|first, second| second.deleted_at.cmp(&first.deleted_at));
    input
        .notes
        .sort_by(|first, second| second.deleted_at.cmp(&first.deleted_at));

    TrashOrder {
        collection_ids: input.collections.into_iter().map(|item| item.id).collect(),
        note_ids: input.notes.into_iter().map(|item| item.id).collect(),
    }
}
