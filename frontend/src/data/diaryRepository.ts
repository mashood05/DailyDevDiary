export type Collection = {
  id: string;
  name: string;
  createdAt: string;
};

export type ScreenshotAttachment = {
  id: string;
  name: string;
  dataUrl: string;
};

export type SetupStep = {
  id: string;
  title: string;
  command: string;
  explanation: string;
  screenshots: ScreenshotAttachment[];
};

export type Note = {
  id: string;
  collectionId: string;
  title: string;
  description: string;
  steps: SetupStep[];
  createdAt: string;
  updatedAt: string;
};

export interface DiaryRepository {
  getCollections(): Promise<Collection[]>;
  createCollection(name: string): Promise<Collection>;
  renameCollection(id: string, name: string): Promise<Collection>;
  deleteCollection(id: string): Promise<void>;
  getNotes(): Promise<Note[]>;
  createNote(collectionId: string): Promise<Note>;
  updateNote(note: Note): Promise<Note>;
  deleteNote(id: string): Promise<void>;
}

export function createEmptyStep(): SetupStep {
  return {
    id: crypto.randomUUID(),
    title: "",
    command: "",
    explanation: "",
    screenshots: [],
  };
}

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
    return this.collections.map((collection) => ({ ...collection }));
  }

  async createCollection(name: string) {
    const collection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
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
    this.collections = this.collections.filter((item) => item.id !== id);
    this.notes = this.notes.filter((note) => note.collectionId !== id);
  }

  async getNotes() {
    return this.notes.map(cloneNote);
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
    this.notes = this.notes.filter((note) => note.id !== id);
  }
}
