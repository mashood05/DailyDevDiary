use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HomeNoteInput {
    id: String,
    updated_at: String,
    command_count: usize,
    snapshot_count: usize,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HomeSummaryInput {
    collection_count: usize,
    notes: Vec<HomeNoteInput>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HomeSummary {
    collection_count: usize,
    note_count: usize,
    command_count: usize,
    snapshot_count: usize,
    recent_note_ids: Vec<String>,
}

#[tauri::command]
pub fn get_home_summary(mut input: HomeSummaryInput) -> HomeSummary {
    input
        .notes
        .sort_by(|first, second| second.updated_at.cmp(&first.updated_at));

    HomeSummary {
        collection_count: input.collection_count,
        note_count: input.notes.len(),
        command_count: input.notes.iter().map(|note| note.command_count).sum(),
        snapshot_count: input.notes.iter().map(|note| note.snapshot_count).sum(),
        recent_note_ids: input
            .notes
            .iter()
            .take(5)
            .map(|note| note.id.clone())
            .collect(),
    }
}
