import Database from "@tauri-apps/plugin-sql";
import type { DiaryRepository } from "./diaryRepository";
import { createEmptyStep, type Collection, type Note, type SetupStep, type ScreenshotAttachment } from "./diaryTypes";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS collections (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at TEXT NOT NULL,
    deleted_at TEXT
  );

  CREATE TABLE IF NOT EXISTS notes (
    id            TEXT PRIMARY KEY,
    collection_id TEXT NOT NULL,
    title         TEXT NOT NULL DEFAULT '',
    description   TEXT NOT NULL DEFAULT '',
    created_at    TEXT NOT NULL,
    updated_at    TEXT NOT NULL,
    deleted_at    TEXT,
    FOREIGN KEY (collection_id) REFERENCES collections(id)
  );

  CREATE TABLE IF NOT EXISTS steps (
    id          TEXT PRIMARY KEY,
    note_id     TEXT NOT NULL,
    title       TEXT NOT NULL DEFAULT '',
    command     TEXT NOT NULL DEFAULT '',
    explanation TEXT NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS screenshots (
    id       TEXT PRIMARY KEY,
    step_id  TEXT NOT NULL,
    name     TEXT NOT NULL,
    data_url TEXT NOT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
  );
`;

export class SqliteDiaryRepository implements DiaryRepository {
  private dbConn: Database | null = null;
  private ready: Promise<Database>;

  constructor() {
    this.ready = this.init();
  }

  private async init(): Promise<Database> {
    const db = await Database.load("sqlite:diary.db");
    await db.execute("PRAGMA foreign_keys = ON");
    await db.execute(SCHEMA);
    this.dbConn = db;
    return db;
  }

  private async getDb(): Promise<Database> {
    if (this.dbConn) return this.dbConn;
    return this.ready;
  }

  async getCollections(): Promise<Collection[]> {
    const db = await this.getDb();
    const rows = await db.select<CollectionRow[]>(
      "SELECT id, name, created_at, deleted_at FROM collections WHERE deleted_at IS NULL ORDER BY created_at",
    );
    return rows.map(toCollection);
  }

  async createCollection(name: string): Promise<Collection> {
    const db = await this.getDb();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await db.execute(
      "INSERT INTO collections (id, name, created_at) VALUES ($1, $2, $3)",
      [id, name.trim(), createdAt],
    );
    return { id, name: name.trim(), createdAt, deletedAt: null };
  }

  async renameCollection(id: string, name: string): Promise<Collection> {
    const db = await this.getDb();
    await db.execute("UPDATE collections SET name = $1 WHERE id = $2", [name.trim(), id]);
    const rows = await db.select<CollectionRow[]>(
      "SELECT id, name, created_at, deleted_at FROM collections WHERE id = $1",
      [id],
    );
    if (!rows.length) throw new Error("Collection not found");
    return toCollection(rows[0]);
  }

  async deleteCollection(id: string): Promise<void> {
    const db = await this.getDb();
    const now = new Date().toISOString();
    await db.execute("UPDATE collections SET deleted_at = $1 WHERE id = $2", [now, id]);
    await db.execute("UPDATE notes SET deleted_at = $1 WHERE collection_id = $2", [now, id]);
  }

  async getDeletedCollections(): Promise<Collection[]> {
    const db = await this.getDb();
    const rows = await db.select<CollectionRow[]>(
      "SELECT id, name, created_at, deleted_at FROM collections WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC",
    );
    return rows.map(toCollection);
  }

  async restoreCollection(id: string): Promise<void> {
    const db = await this.getDb();
    await db.execute("UPDATE collections SET deleted_at = NULL WHERE id = $1", [id]);
    await db.execute(
      "UPDATE notes SET deleted_at = NULL WHERE collection_id = $1 AND deleted_at IS NOT NULL",
      [id],
    );
  }

  async permanentlyDeleteCollection(id: string): Promise<void> {
    const db = await this.getDb();
    await db.execute("DELETE FROM collections WHERE id = $1", [id]);
  }

  async getNotes(): Promise<Note[]> {
    const db = await this.getDb();
    const noteRows = await db.select<NoteRow[]>(
      `SELECT n.id, n.collection_id, n.title, n.description, n.created_at, n.updated_at, n.deleted_at
       FROM notes n
       JOIN collections c ON c.id = n.collection_id
       WHERE n.deleted_at IS NULL AND c.deleted_at IS NULL
       ORDER BY n.updated_at DESC`,
    );

    if (!noteRows.length) return [];

    const noteIds = noteRows.map((row: NoteRow) => row.id);
    const placeholders = noteIds.map((_: string, i: number) => `$${i + 1}`).join(", ");

    const stepRows = await db.select<StepRow[]>(
      `SELECT s.id, s.note_id, s.title, s.command, s.explanation, s.sort_order
       FROM steps s
       WHERE s.note_id IN (${placeholders})
       ORDER BY s.sort_order`,
      noteIds,
    );

    const stepsByNote = new Map<string, StepRow[]>();
    for (const step of stepRows) {
      const list = stepsByNote.get(step.note_id) || [];
      list.push(step);
      stepsByNote.set(step.note_id, list);
    }

    const screenshotRows = await db.select<ScreenshotRow[]>(
      `SELECT ss.id, ss.step_id, ss.name, ss.data_url
       FROM screenshots ss
       JOIN steps s ON s.id = ss.step_id
       WHERE s.note_id IN (${placeholders})`,
      noteIds,
    );

    const screenshotsByStep = new Map<string, ScreenshotRow[]>();
    for (const ss of screenshotRows) {
      const list = screenshotsByStep.get(ss.step_id) || [];
      list.push(ss);
      screenshotsByStep.set(ss.step_id, list);
    }

    return noteRows.map((noteRow: NoteRow) => {
      const stepRowsForNote = stepsByNote.get(noteRow.id) || [];
      const steps: SetupStep[] = stepRowsForNote.map((stepRow: StepRow) => {
        const ssRows = screenshotsByStep.get(stepRow.id) || [];
        const screenshots: ScreenshotAttachment[] = ssRows.map((ss: ScreenshotRow) => ({
          id: ss.id,
          name: ss.name,
          dataUrl: ss.data_url,
        }));
        return {
          id: stepRow.id,
          title: stepRow.title,
          command: stepRow.command,
          explanation: stepRow.explanation,
          screenshots,
        };
      });

      return {
        id: noteRow.id,
        collectionId: noteRow.collection_id,
        title: noteRow.title,
        description: noteRow.description,
        steps,
        createdAt: noteRow.created_at,
        updatedAt: noteRow.updated_at,
        deletedAt: noteRow.deleted_at,
      };
    });
  }

  async createNote(collectionId: string): Promise<Note> {
    const db = await this.getDb();
    const now = new Date().toISOString();
    const noteId = crypto.randomUUID();
    const stepId = crypto.randomUUID();

    await db.execute(
      "INSERT INTO notes (id, collection_id, title, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
      [noteId, collectionId, "", "", now, now],
    );
    await db.execute(
      "INSERT INTO steps (id, note_id, title, command, explanation, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
      [stepId, noteId, "", "", "", 0],
    );

    const step: SetupStep = { id: stepId, title: "", command: "", explanation: "", screenshots: [] };
    return {
      id: noteId,
      collectionId,
      title: "",
      description: "",
      steps: [step],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
  }

  async updateNote(note: Note): Promise<Note> {
    const db = await this.getDb();
    const updatedAt = new Date().toISOString();

    await db.execute("BEGIN");

    try {
      await db.execute(
        "UPDATE notes SET title = $1, description = $2, updated_at = $3 WHERE id = $4",
        [note.title, note.description, updatedAt, note.id],
      );

      await db.execute("DELETE FROM steps WHERE note_id = $1", [note.id]);

      for (let i = 0; i < note.steps.length; i++) {
        const step = note.steps[i];
        const stepId = step.id || crypto.randomUUID();

        await db.execute(
          "INSERT INTO steps (id, note_id, title, command, explanation, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
          [stepId, note.id, step.title, step.command, step.explanation, i],
        );

        for (const ss of step.screenshots) {
          await db.execute(
            "INSERT INTO screenshots (id, step_id, name, data_url) VALUES ($1, $2, $3, $4)",
            [ss.id || crypto.randomUUID(), stepId, ss.name, ss.dataUrl],
          );
        }
      }

      await db.execute("COMMIT");
    } catch (error) {
      await db.execute("ROLLBACK");
      throw error;
    }

    return {
      ...note,
      updatedAt,
      steps: note.steps.map((step: SetupStep) => ({
        ...step,
        screenshots: step.screenshots.map((ss: ScreenshotAttachment) => ({ ...ss })),
      })),
    };
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.getDb();
    await db.execute("UPDATE notes SET deleted_at = $1 WHERE id = $2", [new Date().toISOString(), id]);
  }

  async getDeletedNotes(): Promise<Note[]> {
    const db = await this.getDb();
    const noteRows = await db.select<NoteRow[]>(
      `SELECT n.id, n.collection_id, n.title, n.description, n.created_at, n.updated_at, n.deleted_at
       FROM notes n
       JOIN collections c ON c.id = n.collection_id
       WHERE n.deleted_at IS NOT NULL AND c.deleted_at IS NULL
       ORDER BY n.deleted_at DESC`,
    );

    if (!noteRows.length) return [];

    const noteIds = noteRows.map((row: NoteRow) => row.id);
    const placeholders = noteIds.map((_: string, i: number) => `$${i + 1}`).join(", ");

    const stepRows = await db.select<StepRow[]>(
      `SELECT s.id, s.note_id, s.title, s.command, s.explanation, s.sort_order
       FROM steps s
       WHERE s.note_id IN (${placeholders})
       ORDER BY s.sort_order`,
      noteIds,
    );

    const stepsByNote = new Map<string, StepRow[]>();
    for (const step of stepRows) {
      const list = stepsByNote.get(step.note_id) || [];
      list.push(step);
      stepsByNote.set(step.note_id, list);
    }

    return noteRows.map((noteRow: NoteRow) => {
      const stepRowsForNote = stepsByNote.get(noteRow.id) || [];
      const steps: SetupStep[] = stepRowsForNote.map((stepRow: StepRow) => ({
        id: stepRow.id,
        title: stepRow.title,
        command: stepRow.command,
        explanation: stepRow.explanation,
        screenshots: [],
      }));

      return {
        id: noteRow.id,
        collectionId: noteRow.collection_id,
        title: noteRow.title,
        description: noteRow.description,
        steps,
        createdAt: noteRow.created_at,
        updatedAt: noteRow.updated_at,
        deletedAt: noteRow.deleted_at,
      };
    });
  }

  async restoreNote(id: string): Promise<void> {
    const db = await this.getDb();
    await db.execute("UPDATE notes SET deleted_at = NULL WHERE id = $1", [id]);
  }

  async permanentlyDeleteNote(id: string): Promise<void> {
    const db = await this.getDb();
    await db.execute("DELETE FROM notes WHERE id = $1", [id]);
  }
}

type CollectionRow = {
  id: string;
  name: string;
  created_at: string;
  deleted_at: string | null;
};

type NoteRow = {
  id: string;
  collection_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type StepRow = {
  id: string;
  note_id: string;
  title: string;
  command: string;
  explanation: string;
  sort_order: number;
};

type ScreenshotRow = {
  id: string;
  step_id: string;
  name: string;
  data_url: string;
};

function toCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}
