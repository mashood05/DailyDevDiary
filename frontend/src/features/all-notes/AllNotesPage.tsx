import { FileText, Files, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import type { Collection, Note } from "../../data/diaryTypes";
import { orderByIds } from "../shared/orderByIds";
import { listAllNoteIds } from "./allNotesService";

type AllNotesPageProps = {
  collections: Collection[];
  notes: Note[];
  onOpenNote: (collectionId: string, noteId: string) => void;
};

export function AllNotesPage({ collections, notes, onOpenNote }: AllNotesPageProps) {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    listAllNoteIds(notes).then(setOrderedIds);
  }, [notes]);

  const orderedNotes = orderByIds(notes, orderedIds);

  return (
    <section className="content feature-page all-notes-page" data-feature-page="All Notes">
      <div className="feature-page-heading">
        <span>
          <Files aria-hidden="true" />
        </span>
        <div>
          <h2>All Notes</h2>
          <p>Browse notes from every collection in one place.</p>
        </div>
        <strong className="feature-total">{orderedNotes.length}</strong>
      </div>

      {orderedNotes.length === 0 ? (
        <div className="feature-page-empty">
          <FileText aria-hidden="true" />
          <p>Create a note inside a collection to see it here.</p>
        </div>
      ) : (
        <div className="all-notes-list">
          {orderedNotes.map((note) => {
            const collection = collections.find(
              (item) => item.id === note.collectionId,
            );

            return (
              <button
                type="button"
                key={note.id}
                aria-label={`Open note ${note.title || "Untitled note"}`}
                onClick={() => onOpenNote(note.collectionId, note.id)}
              >
                <span className="all-notes-icon">
                  <FileText aria-hidden="true" />
                </span>
                <span className="all-notes-content">
                  <strong>{note.title || "Untitled note"}</strong>
                  <small>{note.description || "No description"}</small>
                  <span>
                    <em>{collection?.name || "Unknown collection"}</em>
                    <time>{new Date(note.updatedAt).toLocaleDateString()}</time>
                  </span>
                </span>
                <span className="all-notes-steps">
                  <ListChecks aria-hidden="true" />
                  {note.steps.length}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
