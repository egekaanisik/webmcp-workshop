"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  TODOS_UPDATED_EVENT,
  addToDo,
  getToDoList,
  removeToDo,
  toggleToDo,
} from "@/lib/todoStorage";
import { registerTodoTools } from "@/lib/tools";
import type { Todo } from "@/types/todo";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [addError, setAddError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const addInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncTodos = () => {
      setTodos(getToDoList());
    };

    syncTodos();
    setHydrated(true);

    window.addEventListener(TODOS_UPDATED_EVENT, syncTodos);
    const cleanupTools = registerTodoTools();

    return () => {
      window.removeEventListener(TODOS_UPDATED_EVENT, syncTodos);
      cleanupTools();
    };
  }, []);

  function refreshToDos(): void {
    setTodos(getToDoList());
  }

  function handleAddToDo(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setAddError("Please enter a todo item.");
      addInputRef.current?.focus();
      return;
    }

    const created = addToDo(trimmed);
    setNewTitle("");
    setAddError("");
    refreshToDos();
    setStatusMessage(`Added todo: ${created.title}`);
  }

  function handleRemoveToDo(id: string): void {
    const existing = todos.find((todo) => todo.id === id);
    if (!existing) {
      return;
    }

    removeToDo(id);
    refreshToDos();
    setStatusMessage(`Removed todo: ${existing.title}`);
  }

  function handleToggleToDo(id: string): void {
    const updated = toggleToDo(id);
    if (!updated) {
      return;
    }
    refreshToDos();
    setStatusMessage(
      `Marked "${updated.title}" as ${updated.completed ? "completed" : "active"}`
    );
  }

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        py: { xs: 4, sm: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={600}>
                Todo List
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {hydrated
                  ? `${remainingCount} remaining · ${todos.length} total`
                  : "Loading saved todos..."}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleAddToDo} noValidate>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
                <TextField
                  inputRef={addInputRef}
                  id="new-todo-input"
                  name="title"
                  label="New todo"
                  value={newTitle}
                  onChange={(event) => {
                    setNewTitle(event.target.value);
                    if (addError) {
                      setAddError("");
                    }
                  }}
                  error={Boolean(addError)}
                  helperText={addError || " "}
                  fullWidth
                  size="medium"
                  slotProps={{
                    htmlInput: {
                      enterKeyHint: "done",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    minHeight: 56,
                    px: 3,
                    whiteSpace: "nowrap",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>

            <Divider />

            {hydrated && todos.length === 0 ? (
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 4 }}
              >
                No todos yet. Add one above to get started.
              </Typography>
            ) : (
              <List disablePadding>
                {todos.map((todo, index) => (
                  <Box key={todo.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      disableGutters
                      sx={{
                        py: 1.25,
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => handleToggleToDo(todo.id)}
                        inputProps={{
                          "aria-label": `Mark "${todo.title}" as ${
                            todo.completed ? "incomplete" : "completed"
                          }`,
                        }}
                      />
                      <ListItemText
                        primary={todo.title}
                        sx={{
                          flex: 1,
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                          color: todo.completed
                            ? "text.secondary"
                            : "text.primary",
                          wordBreak: "break-word",
                        }}
                      />
                      <IconButton
                        type="button"
                        color="error"
                        aria-label={`Delete "${todo.title}"`}
                        onClick={() => handleRemoveToDo(todo.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </Stack>
        </Paper>
      </Container>

      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: "absolute",
          clipPath: "inset(50%)",
          overflow: "hidden",
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          border: 0,
          whiteSpace: "nowrap",
        }}
      >
        {statusMessage}
      </Box>
    </Box>
  );
}
