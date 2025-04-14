import { Todo } from "../interfaces";

export default function TodoCard({
  todo,
  toggleTodo,
  setStateTodo,
  removeTodo,
}: {
  todo: Todo;
  toggleTodo: (id: number) => void;
  setStateTodo: (todo: Todo) => void;
  removeTodo: (id: number) => void;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: "16px",
        justifyContent: "space-between",
        padding: "0px 16px",
      }}
    >
      <div style={{ display: "flex", gap: "16px" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id!)}
        />
        <div>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => {
            removeTodo(todo.id!);
          }}
        >
          Remove
        </button>
        <button
          onClick={() => {
            setStateTodo(todo);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
