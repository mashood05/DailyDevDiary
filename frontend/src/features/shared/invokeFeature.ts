import { invoke } from "@tauri-apps/api/core";

export async function invokeFeature<T>(
  command: string,
  args: Record<string, unknown>,
  fallback: () => T,
) {
  if ("__TAURI_INTERNALS__" in window) {
    try {
      return await invoke<T>(command, args);
    } catch {
      return fallback();
    }
  }

  return fallback();
}
