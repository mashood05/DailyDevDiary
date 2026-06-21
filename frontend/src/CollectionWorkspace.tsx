import { FilePlus2, FileText, FolderOpen, Plus, Trash2 } from "lucide-react";
import type { Collection, Note } from "./data/diaryRepository";
import { NoteEditor } from "./NoteEditor";

type CollectionWorkspaceProps = {
  collection: Collection | null;
  notes: Note[];
  selectedNote: Note | null;
  saveStatus: "Saved" | "Saving...";
  onCreateNote: () => Promise<void>;
  onSelectNote: (id: string) => void;
  onChangeNote: (note: Note) => void;
  onDeleteNote: (id: string) => Promise<void>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function CollectionWorkspace({
  collection,
  notes,
  selectedNote,
  saveStatus,
  onCreateNote,
  onSelectNote,
  onChangeNote,
  onDeleteNote,
}: CollectionWorkspaceProps) {
  if (!collection) {
    return (
      <section className="content workspace-placeholder">
        <FolderOpen aria-hidden="true" />
        <h2>Select a collection</h2>
        <p>Create or select a collection to start writing.</p>
      </section>
    );
  }

  return (
    <section className="content collection-workspace">
      <header className="workspace-header">
        <div>
          <FolderOpen aria-hidden="true" />
          <div>
            <h2>{collection.name}</h2>
            <span>{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
          </div>
        </div>
        <button className="new-note-button" type="button" onClick={onCreateNote}>
          <Plus aria-hidden="true" />
          New Note
        </button>
      </header>

      <div className="workspace-body">
        <aside className="notes-panel">
          <div className="notes-panel-title">Notes</div>
          {notes.length === 0 && (
            <div className="notes-empty">
              <FileText aria-hidden="true" />
              <span>No notes yet</span>
            </div>
          )}
          {notes.map((note) => (
            <div
              className={`workspace-note-item${
                note.id === selectedNote?.id ? " selected" : ""
              }`}
              key={note.id}
            >
              <button
                className="workspace-note-select"
                type="button"
                aria-label={`Open ${note.title || "Untitled note"}`}
                onClick={() => onSelectNote(note.id)}
              >
                <FileText aria-hidden="true" />
                <span>
                  <strong>{note.title || "Untitled note"}</strong>
                  <small>{formatDate(note.updatedAt)}</small>
                </span>
              </button>
              <button
                className="delete-note-button"
                type="button"
                aria-label={`Delete ${note.title || "Untitled note"}`}
                onClick={() => onDeleteNote(note.id)}
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          ))}
        </aside>

        <div className="note-page">
          {selectedNote ? (
            <>
              <div className={`save-status ${saveStatus === "Saved" ? "saved" : "saving"}`}>
                <span />
                {saveStatus}
              </div>
              <NoteEditor note={selectedNote} onChange={onChangeNote} />
            </>
          ) : (
            <div className="note-placeholder">
              <FilePlus2 aria-hidden="true" />
              <h3>Create your first note</h3>
              <p>Your note will open here as an editable page.</p>
              <button type="button" onClick={onCreateNote}>
                <Plus aria-hidden="true" />
                New Note
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
