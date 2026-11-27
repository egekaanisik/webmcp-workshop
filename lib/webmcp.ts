export interface ModelContextToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

export type JsonSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object"
  | "null";

export interface ModelContextToolInputProperty {
  type: JsonSchemaType;
  description?: string;
  enum?: unknown[];
  items?: ModelContextToolInputProperty;
  properties?: Record<string, ModelContextToolInputProperty>;
  required?: string[];
}

export interface ModelContextToolInputSchema {
  type: "object";
  properties: Record<string, ModelContextToolInputProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ModelContextTool {
  name: string;
  description: string;
  inputSchema?: ModelContextToolInputSchema;
  annotations?: ModelContextToolAnnotations;
  execute: (args: Record<string, unknown>) => unknown | Promise<unknown>;
}

export interface ModelContext {
  registerTool: (
    tool: ModelContextTool,
    options: { signal: AbortSignal }
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
