import { FileText, Folder, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Collection, Note } from "../../data/diaryTypes";
import { orderByIds } from "../shared/orderByIds";
import { listTrash, type TrashOrder } from "./trashService";

type TrashPageProps = {
  collections: Collection[];
  notes: Note[];
  onRestoreCollection: (id: string) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
  onRestoreNote: (id: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
};

const emptyOrder: TrashOrder = { collectionIds: [], noteIds: [] };

export function TrashPage({
  collections,
  notes,
  onRestoreCollection,
  onDeleteCollection,
  onRestoreNote,
  onDeleteNote,
}: TrashPageProps) {
  const [order, setOrder] = useState(emptyOrder);

  useEffect(() => {
    listTrash(collections, notes).then(setOrder);
  }, [collections, notes]);

  const orderedCollections = orderByIds(collections, order.collectionIds);
  const orderedNotes = orderByIds(notes, order.noteIds);
  const total = orderedCollections.length + orderedNotes.length;

  return (
    <section className="content feature-page trash-page" data-feature-page="Trash">
      <div className="feature-page-heading">
        <span>
          <Trash2 aria-hidden="true" />
        </span>
        <div>
          <h2>Trash</h2>
          <p>Restore deleted work or remove it permanently.</p>
        </div>
        <strong className="feature-total">{total}</strong>
      </div>

      {total === 0 ? (
        <div className="feature-page-empty">
          <Trash2 aria-hidden="true" />
          <p>Trash is empty.</p>
        </div>
      ) : (
        <div className="trash-groups">
          {orderedCollections.length > 0 && (
            <section>
              <h3>Collections</h3>
              {orderedCollections.map((collection) => (
                <TrashRow
                  key={collection.id}
                  icon={Folder}
                  name={collection.name}
                  kind="collection"
                  onRestore={() => onRestoreCollection(collection.id)}
                  onDelete={() => onDeleteCollection(collection.id)}
                />
              ))}
            </section>
          )}

          {orderedNotes.length > 0 && (
            <section>
              <h3>Notes</h3>
              {orderedNotes.map((note) => (
                <TrashRow
                  key={note.id}
                  icon={FileText}
                  name={note.title || "Untitled note"}
                  kind="note"
                  onRestore={() => onRestoreNote(note.id)}
                  onDelete={() => onDeleteNote(note.id)}
                />
              ))}
            </section>
          )}
        </div>
      )}
    </section>
  );
}

type TrashRowProps = {
  icon: typeof Folder;
  name: string;
  kind: "collection" | "note";
  onRestore: () => Promise<void>;
  onDelete: () => Promise<void>;
};

function TrashRow({ icon: Icon, name, kind, onRestore, onDelete }: TrashRowProps) {
  return (
    <article className="trash-row">
      <Icon aria-hidden="true" />
      <strong>{name}</strong>
      <button type="button" aria-label={`Restore ${kind} ${name}`} onClick={onRestore}>
        <RotateCcw aria-hidden="true" />
        Restore
      </button>
      <button
        className="trash-delete-forever"
        type="button"
        aria-label={`Permanently delete ${kind} ${name}`}
        onClick={onDelete}
      >
        <X aria-hidden="true" />
        Delete forever
      </button>
    </article>
  );
}
