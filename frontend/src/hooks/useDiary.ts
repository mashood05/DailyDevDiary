import { useEffect, useMemo, useRef, useState } from "react";
import {
  InMemoryDiaryRepository,
  type Collection,
  type DiaryRepository,
  type Note,
} from "../data/diaryRepository";

export function useDiary() {
  const repository = useMemo<DiaryRepository>(() => new InMemoryDiaryRepository(), []);
  const saveTimers = useRef(new Map<string, number>());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving...">("Saved");

  useEffect(() => {
    Promise.all([repository.getCollections(), repository.getNotes()]).then(
      ([storedCollections, storedNotes]) => {
        setCollections(storedCollections);
        setNotes(storedNotes);
      },
    );

    return () => {
      saveTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [repository]);

  async function createCollection(name: string) {
    const collection = await repository.createCollection(name);
    setCollections(await repository.getCollections());
    setSelectedCollectionId(collection.id);
    setSelectedNoteId(null);
  }

  async function renameCollection(id: string, name: string) {
    await repository.renameCollection(id, name);
    setCollections(await repository.getCollections());
  }

  async function deleteCollection(id: string) {
    notes
      .filter((note) => note.collectionId === id)
      .forEach((note) => {
        const timer = saveTimers.current.get(note.id);
        if (timer) window.clearTimeout(timer);
        saveTimers.current.delete(note.id);
      });

    await repository.deleteCollection(id);
    setCollections(await repository.getCollections());
    setNotes(await repository.getNotes());

    if (selectedCollectionId === id) {
      setSelectedCollectionId(null);
      setSelectedNoteId(null);
    }
  }

  function selectCollection(id: string) {
    setSelectedCollectionId(id);
    setSelectedNoteId(notes.find((note) => note.collectionId === id)?.id ?? null);
  }

  async function createNote() {
    if (!selectedCollectionId) return;

    const note = await repository.createNote(selectedCollectionId);
    setNotes(await repository.getNotes());
    setSelectedNoteId(note.id);
    setSaveStatus("Saved");
  }

  async function deleteNote(id: string) {
    const deletedNote = notes.find((note) => note.id === id);
    const timer = saveTimers.current.get(id);

    if (timer) window.clearTimeout(timer);
    saveTimers.current.delete(id);
    await repository.deleteNote(id);

    const storedNotes = await repository.getNotes();
    setNotes(storedNotes);

    if (selectedNoteId === id) {
      setSelectedNoteId(
        storedNotes.find((note) => note.collectionId === deletedNote?.collectionId)?.id ?? null,
      );
    }
  }

  function updateNote(note: Note) {
    const updatedNote = { ...note, updatedAt: new Date().toISOString() };
    setNotes((currentNotes) =>
      currentNotes.map((currentNote) =>
        currentNote.id === updatedNote.id ? updatedNote : currentNote,
      ),
    );
    setSaveStatus("Saving...");

    const currentTimer = saveTimers.current.get(note.id);
    if (currentTimer) window.clearTimeout(currentTimer);

    const timer = window.setTimeout(async () => {
      try {
        await repository.updateNote(updatedNote);
      } finally {
        saveTimers.current.delete(note.id);
        setSaveStatus("Saved");
      }
    }, 400);

    saveTimers.current.set(note.id, timer);
  }

  const selectedCollection =
    collections.find((collection) => collection.id === selectedCollectionId) ?? null;
  const collectionNotes = notes.filter(
    (note) => note.collectionId === selectedCollectionId,
  );
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;
  const recentNotes = [...notes]
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
    .slice(0, 5);
  const noteCounts = Object.fromEntries(
    collections.map((collection) => [
      collection.id,
      notes.filter((note) => note.collectionId === collection.id).length,
    ]),
  );

  return {
    collections,
    collectionNotes,
    recentNotes,
    noteCounts,
    selectedCollection,
    selectedCollectionId,
    selectedNote,
    selectedNoteId,
    saveStatus,
    selectCollection,
    selectNote: setSelectedNoteId,
    createCollection,
    renameCollection,
    deleteCollection,
    createNote,
    updateNote,
    deleteNote,
  };
}
