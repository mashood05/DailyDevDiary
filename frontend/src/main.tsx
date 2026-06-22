import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import { Minus, PanelLeftClose, PanelLeftOpen, Square, X } from "lucide-react";
import { CollectionWorkspace } from "./CollectionWorkspace";
import { FeatureRouter } from "./features/FeatureRouter";
import type { FeatureKey } from "./features/types";
import { Sidebar } from "./Sidebar";
import { useDiary } from "./hooks/useDiary";
import appLogo from "./assets/images/logo.png";
import "./style.css";

const isTauri = "__TAURI_INTERNALS__" in window;

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFeature, setActiveFeature] = useState<FeatureKey | null>("home");
  const {
    collections,
    notes,
    deletedCollections,
    deletedNotes,
    collectionNotes,
    recentNotes,
    noteCounts,
    selectedCollection,
    selectedCollectionId,
    selectedNote,
    selectedNoteId,
    saveStatus,
    selectCollection,
    selectNote,
    createCollection,
    renameCollection,
    deleteCollection,
    createNote,
    updateNote,
    deleteNote,
    restoreCollection,
    permanentlyDeleteCollection,
    restoreNote,
    permanentlyDeleteNote,
  } = useDiary();

  const [appWindow, setAppWindow] = useState<{
    minimize: () => Promise<void>;
    toggleMaximize: () => Promise<void>;
    close: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (!isTauri) return;

    import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
      const win = getCurrentWindow();
      setAppWindow({
        minimize: () => win.minimize(),
        toggleMaximize: () => win.toggleMaximize(),
        close: () => win.close(),
      });
    });
  }, []);

  return (
    <div className="app-root">
      <header className="title-bar" data-tauri-drag-region>
        <button
          className="title-bar-toggle"
          type="button"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <PanelLeftClose aria-hidden="true" />
          ) : (
            <PanelLeftOpen aria-hidden="true" />
          )}
        </button>
        <img className="title-bar-logo" src={appLogo} alt="" />
        <span className="title-bar-name">DailyDevDiary</span>

        {appWindow && (
          <div className="title-bar-controls">
            <button
              type="button"
              aria-label="Minimize"
              onClick={() => appWindow.minimize()}
            >
              <Minus aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Maximize"
              onClick={() => appWindow.toggleMaximize()}
            >
              <Square aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => appWindow.close()}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      <main className="app-shell">
        {isSidebarOpen && (
          <Sidebar
            collections={collections}
            recentNotes={recentNotes}
            noteCounts={noteCounts}
            activeFeature={activeFeature}
            selectedCollectionId={selectedCollectionId}
            selectedNoteId={selectedNoteId}
            onSelectCollection={(collectionId) => {
              selectCollection(collectionId);
              setActiveFeature(null);
            }}
            onSelectFeature={setActiveFeature}
            onSelectNote={(collectionId, noteId) => {
              selectCollection(collectionId);
              selectNote(noteId);
              setActiveFeature(null);
            }}
            onCreateCollection={createCollection}
            onRenameCollection={renameCollection}
            onDeleteCollection={deleteCollection}
          />
        )}

        <div className="main-area">
          {activeFeature ? (
            <FeatureRouter
              feature={activeFeature}
              collections={collections}
              notes={notes}
              onOpenNote={(collectionId, noteId) => {
                selectCollection(collectionId);
                selectNote(noteId);
                setActiveFeature(null);
              }}
              deletedCollections={deletedCollections}
              deletedNotes={deletedNotes}
              onRestoreCollection={restoreCollection}
              onPermanentlyDeleteCollection={permanentlyDeleteCollection}
              onRestoreNote={restoreNote}
              onPermanentlyDeleteNote={permanentlyDeleteNote}
            />
          ) : (
            <CollectionWorkspace
              collection={selectedCollection}
              notes={collectionNotes}
              selectedNote={selectedNote}
              saveStatus={saveStatus}
              onCreateNote={createNote}
              onSelectNote={selectNote}
              onChangeNote={updateNote}
              onDeleteNote={deleteNote}
            />
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
