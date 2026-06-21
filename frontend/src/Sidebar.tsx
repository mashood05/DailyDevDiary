import {
  ArrowUpRight,
  Camera,
  FileText,
  Folder,
  Home,
  PanelLeftClose,
  Pencil,
  Plus,
  Search,
  Settings,
  SquareTerminal,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import appLogo from "./assets/images/logo.png";
import type { Collection, Note } from "./data/diaryRepository";

const menuItems = [
  { label: "Home", icon: Home, active: true },
  { label: "All Notes", icon: FileText },
  { label: "Commands", icon: SquareTerminal },
  { label: "Snapshots", icon: Camera },
  { label: "Templates", icon: ArrowUpRight },
  { label: "Trash", icon: Trash2 },
];

type SidebarProps = {
  collections: Collection[];
  recentNotes: Note[];
  noteCounts: Record<string, number>;
  selectedCollectionId: string | null;
  selectedNoteId: string | null;
  onClose: () => void;
  onSelectCollection: (id: string) => void;
  onSelectNote: (collectionId: string, noteId: string) => void;
  onCreateCollection: (name: string) => Promise<void>;
  onRenameCollection: (id: string, name: string) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
};

export function Sidebar({
  collections,
  recentNotes,
  noteCounts,
  selectedCollectionId,
  selectedNoteId,
  onClose,
  onSelectCollection,
  onSelectNote,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  async function submitNewCollection(event: FormEvent) {
    event.preventDefault();
    const name = draftName.trim();

    if (!name) return;

    await onCreateCollection(name);
    setDraftName("");
    setIsCreating(false);
  }

  async function submitRename(event: FormEvent, id: string) {
    event.preventDefault();
    const name = draftName.trim();

    if (!name) return;

    await onRenameCollection(id, name);
    setDraftName("");
    setEditingId(null);
  }

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1>
          <img className="app-icon" src={appLogo} alt="" />
          DailyDevDiary
        </h1>
        <button
          className="toggle-button"
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <PanelLeftClose aria-hidden="true" />
        </button>
      </header>

      <div className="sidebar-body">
        <div className="search-box">
          <Search aria-hidden="true" />
          <input type="text" placeholder="Search notes..." aria-label="Search notes" />
          <span>Ctrl + K</span>
        </div>

        <nav className="main-menu" aria-label="Main menu">
          {menuItems.map(({ label, icon: Icon, active }) => (
            <div
              className={`menu-item${active && !selectedCollectionId ? " active" : ""}`}
              key={label}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <section className="sidebar-section">
          <div className="section-heading">
            <span>Recent Notes</span>
            <Plus aria-hidden="true" />
          </div>
          {recentNotes.length === 0 && <p className="recent-empty">No recent notes</p>}
          {recentNotes.map((note) => (
            <button
              className={`note-item${note.id === selectedNoteId ? " selected" : ""}`}
              type="button"
              key={note.id}
              onClick={() => onSelectNote(note.collectionId, note.id)}
            >
              <FileText aria-hidden="true" />
              <div>
                <strong>{note.title || "Untitled note"}</strong>
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </section>

        <section className="sidebar-section collections">
          <div className="section-heading">
            <span>Collections</span>
            <button
              className="section-action"
              type="button"
              aria-label="Create collection"
              onClick={() => {
                setEditingId(null);
                setDraftName("");
                setIsCreating(true);
              }}
            >
              <Plus aria-hidden="true" />
            </button>
          </div>

          {isCreating && (
            <form className="collection-form" onSubmit={submitNewCollection}>
              <Folder aria-hidden="true" />
              <input
                autoFocus
                value={draftName}
                aria-label="New collection name"
                placeholder="Collection name"
                onChange={(event) => setDraftName(event.target.value)}
              />
              <button type="submit" aria-label="Save collection">
                <Check aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Cancel collection"
                onClick={() => setIsCreating(false)}
              >
                <X aria-hidden="true" />
              </button>
            </form>
          )}

          {!isCreating && collections.length === 0 && (
            <p className="collections-empty">No collections yet</p>
          )}

          {collections.map((collection) =>
            editingId === collection.id ? (
              <form
                className="collection-form"
                key={collection.id}
                onSubmit={(event) => submitRename(event, collection.id)}
              >
                <Folder aria-hidden="true" />
                <input
                  autoFocus
                  value={draftName}
                  aria-label={`Rename ${collection.name}`}
                  onChange={(event) => setDraftName(event.target.value)}
                />
                <button type="submit" aria-label="Save collection name">
                  <Check aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Cancel rename"
                  onClick={() => setEditingId(null)}
                >
                  <X aria-hidden="true" />
                </button>
              </form>
            ) : (
              <div
                className={`collection-item${
                  selectedCollectionId === collection.id ? " selected" : ""
                }`}
                key={collection.id}
              >
                <button
                  className="collection-select"
                  type="button"
                  aria-label={`Select ${collection.name}`}
                  onClick={() => onSelectCollection(collection.id)}
                >
                  <Folder aria-hidden="true" />
                  <span>{collection.name}</span>
                  <small>{noteCounts[collection.id] ?? 0}</small>
                </button>
                <div className="collection-actions">
                  <button
                    type="button"
                    aria-label={`Rename ${collection.name}`}
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(collection.id);
                      setDraftName(collection.name);
                    }}
                  >
                    <Pencil aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${collection.name}`}
                    onClick={() => onDeleteCollection(collection.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </div>
            ),
          )}
        </section>
      </div>

      <div className="settings-item">
        <Settings aria-hidden="true" />
        <span>Settings</span>
      </div>
    </aside>
  );
}
