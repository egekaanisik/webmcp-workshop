export interface ModelContextToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

export interface ModelContextTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: ModelContextToolAnnotations;
  execute: (args: Record<string, unknown>) => unknown | Promise<unknown>;
}

export interface ModelContext {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal }
  ) => void | Promise<void>;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }

  interface Navigator {
    modelContext?: ModelContext;
  }
}

export function getModelContext(): ModelContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  return document.modelContext ?? navigator.modelContext ?? null;
}
