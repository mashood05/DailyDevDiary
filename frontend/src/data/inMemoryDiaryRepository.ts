import type { DiaryRepository } from "./diaryRepository";
import { createEmptyStep, type Collection, type Note } from "./diaryTypes";

function cloneNote(note: Note): Note {
  return {
    ...note,
    steps: note.steps.map((step) => ({
      ...step,
      screenshots: step.screenshots.map((screenshot) => ({ ...screenshot })),
    })),
  };
}

export class InMemoryDiaryRepository implements DiaryRepository {
  private collections: Collection[] = [];
  private notes: Note[] = [];

  async getCollections() {
    return this.collections
      .filter((collection) => !collection.deletedAt)
      .map((collection) => ({ ...collection }));
  }

  async createCollection(name: string) {
    const collection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };

    this.collections.push(collection);
    return { ...collection };
  }

  async renameCollection(id: string, name: string) {
    const collection = this.collections.find((item) => item.id === id);
    if (!collection) throw new Error("Collection not found");

    collection.name = name.trim();
    return { ...collection };
  }

  async deleteCollection(id: string) {
    const collection = this.collections.find((item) => item.id === id);
    if (collection) collection.deletedAt = new Date().toISOString();
  }

  async getDeletedCollections() {
    return this.collections
      .filter((collection) => collection.deletedAt)
      .map((collection) => ({ ...collection }));
  }

  async restoreCollection(id: string) {
    const collection = this.collections.find((item) => item.id === id);
    if (collection) collection.deletedAt = null;
  }

  async permanentlyDeleteCollection(id: string) {
    this.collections = this.collections.filter((item) => item.id !== id);
    this.notes = this.notes.filter((note) => note.collectionId !== id);
  }

  async getNotes() {
    const activeCollectionIds = new Set(
      this.collections
        .filter((collection) => !collection.deletedAt)
        .map((collection) => collection.id),
    );

    return this.notes
      .filter((note) => !note.deletedAt && activeCollectionIds.has(note.collectionId))
      .map(cloneNote);
  }

  async createNote(collectionId: string) {
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      collectionId,
      title: "",
      description: "",
      steps: [createEmptyStep()],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    this.notes.push(note);
    return cloneNote(note);
  }

  async updateNote(note: Note) {
    const index = this.notes.findIndex((item) => item.id === note.id);
    if (index === -1) throw new Error("Note not found");

    const updatedNote = {
      ...cloneNote(note),
      updatedAt: new Date().toISOString(),
    };

    this.notes[index] = updatedNote;
    return cloneNote(updatedNote);
  }

  async deleteNote(id: string) {
    const note = this.notes.find((item) => item.id === id);
    if (note) note.deletedAt = new Date().toISOString();
  }

  async getDeletedNotes() {
    const activeCollectionIds = new Set(
      this.collections
        .filter((collection) => !collection.deletedAt)
        .map((collection) => collection.id),
    );

    return this.notes
      .filter((note) => note.deletedAt && activeCollectionIds.has(note.collectionId))
      .map(cloneNote);
  }

  async restoreNote(id: string) {
    const note = this.notes.find((item) => item.id === id);
    if (note) note.deletedAt = null;
  }

  async permanentlyDeleteNote(id: string) {
    this.notes = this.notes.filter((note) => note.id !== id);
  }
}
