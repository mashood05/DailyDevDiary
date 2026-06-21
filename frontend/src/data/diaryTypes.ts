export type Collection = {
  id: string;
  name: string;
  createdAt: string;
  deletedAt: string | null;
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
  deletedAt: string | null;
};

export function createEmptyStep(): SetupStep {
  return {
    id: crypto.randomUUID(),
    title: "",
    command: "",
    explanation: "",
    screenshots: [],
  };
}
