import React from "react";
import { Todo } from "../interfaces";

export default function TodoForm({
  stateTodo,
  setStateTodo,
  addTodo,
  editTodo,
}: {
  stateTodo: Todo;
  setStateTodo: React.Dispatch<React.SetStateAction<Todo>>;
  addTodo: () => void;
  editTodo: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
      }}
    >
      <h1>{stateTodo.id == null ? "Add New Todo" : "Edit Todo List"}</h1>
      <input
        type="text"
        value={stateTodo.title}
        onChange={(e) =>
          setStateTodo((prev) => ({ ...prev, title: e.target.value }))
        }
        placeholder="Title"
      />
      <textarea
        rows={5}
        placeholder="Description"
        value={stateTodo.description}
        onChange={(e) =>
          setStateTodo((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <div style={{ display: "flex", gap: "16px", justifyContent: "end" }}>
        {stateTodo.id != null && (
          <button
            onClick={() => {
              setStateTodo({
                id: null,
                title: "",
                completed: false,
                description: "",
                createdAt: "",
              });
            }}
          >
            cancel
          </button>
        )}
        {stateTodo.id != null ? (
          <button onClick={editTodo}>Save</button>
        ) : (
          <button onClick={addTodo}>Add</button>
        )}
      </div>
    </div>
  );
}
