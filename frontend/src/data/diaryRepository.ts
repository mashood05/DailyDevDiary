import type { Collection, Note } from "./diaryTypes";

export interface DiaryRepository {
  getCollections(): Promise<Collection[]>;
  createCollection(name: string): Promise<Collection>;
  renameCollection(id: string, name: string): Promise<Collection>;
  deleteCollection(id: string): Promise<void>;
  getDeletedCollections(): Promise<Collection[]>;
  restoreCollection(id: string): Promise<void>;
  permanentlyDeleteCollection(id: string): Promise<void>;
  getNotes(): Promise<Note[]>;
  createNote(collectionId: string): Promise<Note>;
  updateNote(note: Note): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  getDeletedNotes(): Promise<Note[]>;
  restoreNote(id: string): Promise<void>;
  permanentlyDeleteNote(id: string): Promise<void>;
}
