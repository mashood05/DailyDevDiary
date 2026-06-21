import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import { CollectionWorkspace } from "./CollectionWorkspace";
import { FeatureRouter } from "./features/FeatureRouter";
import type { FeatureKey } from "./features/types";
import { Sidebar } from "./Sidebar";
import { useDiary } from "./hooks/useDiary";
import "./style.css";

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

  return (
    <main className="app-shell">
      {isSidebarOpen ? (
        <Sidebar
          collections={collections}
          recentNotes={recentNotes}
          noteCounts={noteCounts}
          activeFeature={activeFeature}
          selectedCollectionId={selectedCollectionId}
          selectedNoteId={selectedNoteId}
          onClose={() => setIsSidebarOpen(false)}
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
      ) : (
        <button
          className="open-button"
          type="button"
          aria-label="Open sidebar"
          onClick={() => setIsSidebarOpen(true)}
        >
          <PanelLeftOpen aria-hidden="true" />
        </button>
      )}
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
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
