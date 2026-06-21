import { Camera, FileText, Folder, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";
import type { Collection, Note } from "../../data/diaryTypes";
import { orderByIds } from "../shared/orderByIds";
import { getHomeSummary, type HomeSummary } from "./homeService";

type HomePageProps = {
  collections: Collection[];
  notes: Note[];
  onOpenNote: (collectionId: string, noteId: string) => void;
};

const emptySummary: HomeSummary = {
  collectionCount: 0,
  noteCount: 0,
  commandCount: 0,
  snapshotCount: 0,
  recentNoteIds: [],
};

export function HomePage({ collections, notes, onOpenNote }: HomePageProps) {
  const [summary, setSummary] = useState(emptySummary);

  useEffect(() => {
    getHomeSummary(collections, notes).then(setSummary);
  }, [collections, notes]);

  const cards = [
    { label: "Collections", value: summary.collectionCount, icon: Folder },
    { label: "Notes", value: summary.noteCount, icon: FileText },
    { label: "Commands", value: summary.commandCount, icon: SquareTerminal },
    { label: "Snapshots", value: summary.snapshotCount, icon: Camera },
  ];
  const recentNotes = orderByIds(notes, summary.recentNoteIds);

  return (
    <section className="content feature-page home-page" data-feature-page="Home">
      <div className="feature-page-heading">
        <span>
          <Folder aria-hidden="true" />
        </span>
        <div>
          <h2>Home</h2>
          <p>A clear overview of your DailyDevDiary workspace.</p>
        </div>
      </div>

      <div className="home-summary-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <article className="home-summary-card" key={label}>
            <span>
              <Icon aria-hidden="true" />
            </span>
            <div>
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          </article>
        ))}
      </div>

      <section className="home-recent-section">
        <div className="home-section-heading">
          <h3>Recent Notes</h3>
          <span>{recentNotes.length}</span>
        </div>
        {recentNotes.length === 0 ? (
          <div className="home-empty-state">
            <FileText aria-hidden="true" />
            <p>Your recently edited notes will appear here.</p>
          </div>
        ) : (
          <div className="home-recent-list">
            {recentNotes.map((note) => {
              const collection = collections.find(
                (item) => item.id === note.collectionId,
              );

              return (
                <button
                  type="button"
                  key={note.id}
                  onClick={() => onOpenNote(note.collectionId, note.id)}
                >
                  <FileText aria-hidden="true" />
                  <span>
                    <strong>{note.title || "Untitled note"}</strong>
                    <small>{collection?.name || "Unknown collection"}</small>
                  </span>
                  <time>{new Date(note.updatedAt).toLocaleDateString()}</time>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
