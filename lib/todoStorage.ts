import type { Todo } from "@/types/todo";

const STORAGE_KEY = "todo_list_items";
export const TODOS_UPDATED_EVENT = "todos-updated";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateToDoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveToDoList(todos: Todo[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  window.dispatchEvent(new Event(TODOS_UPDATED_EVENT));
}

export function getToDoList(): Todo[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidTodo);
  } catch {
    return [];
  }
}

function isValidTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.completed === "boolean" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export function addToDo(title: string): Todo {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("Todo title cannot be empty.");
  }

  const now = new Date().toISOString();
  const newTodo: Todo = {
    id: generateToDoId(),
    title: trimmedTitle,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  const todos = getToDoList();
  saveToDoList([newTodo, ...todos]);
  return newTodo;
}

export function removeToDo(id: string): boolean {
  const todos = getToDoList();
  const nextTodos = todos.filter((todo) => todo.id !== id);

  if (nextTodos.length === todos.length) {
    return false;
  }

  saveToDoList(nextTodos);
  return true;
}

export function toggleToDo(id: string): Todo | undefined {
  const todos = getToDoList();
  let updatedTodo: Todo | undefined;

  const nextTodos = todos.map((todo) => {
    if (todo.id !== id) {
      return todo;
    }

    updatedTodo = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date().toISOString(),
    };

    return updatedTodo;
  });

  if (!updatedTodo) {
    return undefined;
  }

  saveToDoList(nextTodos);
  return updatedTodo;
}
