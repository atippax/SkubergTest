import { Todo } from "../interfaces";
import TodoCard from "./TodoCard";

export default function TodoList({
  removeTodo,
  setStateTodo,
  todos,
  toggleTodo,
}: {
  todos: Todo[];
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  setStateTodo: (todo: Todo) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ padding: "16px 16px" }}>Todo List</h1>
      <div style={{ border: "1px solid black" }}></div>
      <div style={{ position: "relative", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
          }}
        >
          <ul style={{ listStyle: "none", padding: "0px" }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ borderBottom: "1px solid white" }}>
                <TodoCard
                  removeTodo={removeTodo}
                  setStateTodo={setStateTodo}
                  todo={todo}
                  toggleTodo={toggleTodo}
                ></TodoCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
