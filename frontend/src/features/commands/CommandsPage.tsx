import { Check, Copy, ExternalLink, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";
import type { Note } from "../../data/diaryTypes";
import { listCommands, type CommandRecord } from "./commandsService";

type CommandsPageProps = {
  notes: Note[];
  onOpenNote: (collectionId: string, noteId: string) => void;
};

export function CommandsPage({ notes, onOpenNote }: CommandsPageProps) {
  const [commands, setCommands] = useState<CommandRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    listCommands(notes).then(setCommands);
  }, [notes]);

  async function copyCommand(record: CommandRecord) {
    await navigator.clipboard.writeText(record.command);
    setCopiedId(record.id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }

  return (
    <section className="content feature-page commands-page" data-feature-page="Commands">
      <div className="feature-page-heading">
        <span>
          <SquareTerminal aria-hidden="true" />
        </span>
        <div>
          <h2>Commands</h2>
          <p>Find and reuse commands saved inside your setup steps.</p>
        </div>
        <strong className="feature-total">{commands.length}</strong>
      </div>

      {commands.length === 0 ? (
        <div className="feature-page-empty">
          <SquareTerminal aria-hidden="true" />
          <p>Commands added to setup steps will appear here.</p>
        </div>
      ) : (
        <div className="commands-list">
          {commands.map((record) => (
            <article className="command-record" key={record.id}>
              <div className="command-record-heading">
                <div>
                  <strong>{record.stepTitle}</strong>
                  <small>{record.noteTitle}</small>
                </div>
                <button
                  type="button"
                  aria-label={`Open source note ${record.noteTitle}`}
                  onClick={() => onOpenNote(record.collectionId, record.noteId)}
                >
                  <ExternalLink aria-hidden="true" />
                </button>
              </div>
              <div className="command-record-code">
                <span aria-hidden="true">$</span>
                <code>{record.command}</code>
                <button
                  type="button"
                  aria-label={`Copy command ${record.command}`}
                  onClick={() => copyCommand(record)}
                >
                  {copiedId === record.id ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                  {copiedId === record.id ? "Copied" : "Copy"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
