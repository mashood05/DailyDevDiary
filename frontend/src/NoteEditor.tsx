import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import {
  createEmptyStep,
  type Note,
  type SetupStep,
} from "./data/diaryRepository";

type NoteEditorProps = {
  note: Note;
  onChange: (note: Note) => void;
};

export function NoteEditor({ note, onChange }: NoteEditorProps) {
  function readScreenshot(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function updateNoteField(field: "title" | "description", value: string) {
    onChange({ ...note, [field]: value });
  }

  function updateStep(
    stepId: string,
    field: keyof Pick<SetupStep, "title" | "command" | "explanation">,
    value: string,
  ) {
    onChange({
      ...note,
      steps: note.steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step,
      ),
    });
  }

  function insertStep(index: number) {
    const steps = [...note.steps];
    steps.splice(index, 0, createEmptyStep());
    onChange({ ...note, steps });
  }

  function deleteStep(stepId: string) {
    onChange({ ...note, steps: note.steps.filter((step) => step.id !== stepId) });
  }

  async function attachScreenshots(stepId: string, files: FileList | null) {
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const screenshots = await Promise.all(
      imageFiles.map(async (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        dataUrl: await readScreenshot(file),
      })),
    );

    onChange({
      ...note,
      steps: note.steps.map((step) =>
        step.id === stepId
          ? { ...step, screenshots: [...step.screenshots, ...screenshots] }
          : step,
      ),
    });
  }

  function removeScreenshot(stepId: string, screenshotId: string) {
    onChange({
      ...note,
      steps: note.steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              screenshots: step.screenshots.filter(
                (screenshot) => screenshot.id !== screenshotId,
              ),
            }
          : step,
      ),
    });
  }

  return (
    <article className="note-editor">
      <input
        className="note-title-input"
        value={note.title}
        aria-label="Note title"
        placeholder="Untitled note"
        onChange={(event) => updateNoteField("title", event.target.value)}
      />
      <textarea
        className="note-description-input"
        value={note.description}
        aria-label="Note description"
        placeholder="Add a short description..."
        rows={1}
        onChange={(event) => updateNoteField("description", event.target.value)}
      />

      <div className="steps-heading">Setup Steps</div>

      <div className="steps-list">
        {note.steps.map((step, index) => (
          <section className="step-card" key={step.id}>
            <div className="step-heading">
              <span className="step-number">{index + 1}</span>
              <input
                value={step.title}
                aria-label={`Step ${index + 1} title`}
                placeholder="Step title..."
                onChange={(event) => updateStep(step.id, "title", event.target.value)}
              />
              <div className="step-actions">
                <button
                  type="button"
                  aria-label={`Insert step after ${index + 1}`}
                  onClick={() => insertStep(index + 1)}
                >
                  <Plus aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete step ${index + 1}`}
                  onClick={() => deleteStep(step.id)}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="command-input-wrap">
              <span aria-hidden="true">$</span>
              <textarea
                value={step.command}
                aria-label={`Step ${index + 1} command`}
                placeholder="Enter a command or code..."
                rows={2}
                spellCheck={false}
                onChange={(event) => updateStep(step.id, "command", event.target.value)}
              />
            </div>

            <textarea
              className="step-explanation-input"
              value={step.explanation}
              aria-label={`Step ${index + 1} explanation`}
              placeholder="Add an optional explanation..."
              rows={1}
              onChange={(event) => updateStep(step.id, "explanation", event.target.value)}
            />

            {step.screenshots.length > 0 && (
              <div className="screenshot-grid">
                {step.screenshots.map((screenshot) => (
                  <figure className="screenshot-card" key={screenshot.id}>
                    <img src={screenshot.dataUrl} alt={screenshot.name} />
                    <figcaption>{screenshot.name}</figcaption>
                    <button
                      type="button"
                      aria-label={`Remove screenshot ${screenshot.name}`}
                      onClick={() => removeScreenshot(step.id, screenshot.id)}
                    >
                      <X aria-hidden="true" />
                    </button>
                  </figure>
                ))}
              </div>
            )}

            <label className="attach-screenshot-button">
              <ImagePlus aria-hidden="true" />
              Attach screenshots
              <input
                type="file"
                accept="image/*"
                multiple
                aria-label={`Attach screenshots to step ${index + 1}`}
                onChange={(event) => {
                  attachScreenshots(step.id, event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
          </section>
        ))}
      </div>

      <button
        className="add-step-button"
        type="button"
        onClick={() => insertStep(note.steps.length)}
      >
        <Plus aria-hidden="true" />
        Add setup step
      </button>
    </article>
  );
}
