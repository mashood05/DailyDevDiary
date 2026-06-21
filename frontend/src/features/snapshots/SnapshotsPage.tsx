import { Camera, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { Note } from "../../data/diaryRepository";
import { listSnapshots, type SnapshotRecord } from "./snapshotsService";

type SnapshotsPageProps = {
  notes: Note[];
  onOpenNote: (collectionId: string, noteId: string) => void;
};

export function SnapshotsPage({ notes, onOpenNote }: SnapshotsPageProps) {
  const [snapshots, setSnapshots] = useState<SnapshotRecord[]>([]);

  useEffect(() => {
    listSnapshots(notes).then(setSnapshots);
  }, [notes]);

  return (
    <section className="content feature-page snapshots-page" data-feature-page="Snapshots">
      <div className="feature-page-heading">
        <span>
          <Camera aria-hidden="true" />
        </span>
        <div>
          <h2>Snapshots</h2>
          <p>Review screenshots attached across your technical notes.</p>
        </div>
        <strong className="feature-total">{snapshots.length}</strong>
      </div>

      {snapshots.length === 0 ? (
        <div className="feature-page-empty">
          <Camera aria-hidden="true" />
          <p>Screenshots attached to setup steps will appear here.</p>
        </div>
      ) : (
        <div className="snapshots-gallery">
          {snapshots.map((snapshot) => (
            <article className="snapshot-record" key={snapshot.id}>
              <img src={snapshot.dataUrl} alt={snapshot.name} />
              <div>
                <strong>{snapshot.name}</strong>
                <small>{snapshot.noteTitle}</small>
                <span>{snapshot.stepTitle}</span>
              </div>
              <button
                type="button"
                aria-label={`Open snapshot source ${snapshot.name}`}
                onClick={() => onOpenNote(snapshot.collectionId, snapshot.noteId)}
              >
                <ExternalLink aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
