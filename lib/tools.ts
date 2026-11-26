import {
  addToDo,
  getToDoList,
  removeToDo,
  toggleToDo,
} from "@/lib/todoStorage";
import { getModelContext } from "@/lib/webmcp";

export function registerTodoTools(): () => void {
  const modelContext = getModelContext();
  if (!modelContext) {
    return () => { };
  }

  const controller = new AbortController();

  /*
  ###############################################################################
  Hint:

  modelContext.registerTool(
    {
      name: string,
      description: string,
      inputSchema?: { // optional if no args, or use { type: "object", properties: {} }
        type: "object",
        properties: {
          <fieldName>: { // replace with your argument name (e.g. title, id)
            type: "string" | "number" | "integer" | "boolean" | "array" | "object" | "null",
            description: string,
          },
        },
        required?: string[],
      },
      annotations?: {
        readOnlyHint?: boolean,         // tool only reads data
        consequentialHint?: boolean,    // destructive or irreversible action
        untrustedContentHint?: boolean, // returns user-generated text
      },
      // Tip: destructure args and cast as needed, e.g. ({ title }) => addToDo(String(title))
      execute: (args: Record<string, unknown>) => unknown | Promise<unknown>,
    },
    { signal: controller.signal }
  );

  ###############################################################################

  Todo item structure:

  {
    id: string,
    title: string,
    completed: boolean,
    createdAt: string, // ISO timestamp
    updatedAt: string, // ISO timestamp
  }

  ###############################################################################

  Tools to implement:

  1. list_todos  - List all todo items (uses getToDoList())
  2. add_todo    - Add a new todo item with `title` (uses addToDo(title))
  3. toggle_todo - Toggle a todo's completed status by `id` (uses toggleToDo(id))
  4. remove_todo - Delete a todo item by `id` (uses removeToDo(id))

  ###############################################################################
  */

  // ###############################################################################
  // TODO: Implement the tools below
  // ###############################################################################




  return () => {
    controller.abort();
  };
}
