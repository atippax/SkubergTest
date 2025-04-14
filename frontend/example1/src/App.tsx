import { useEffect, useState } from "react";
import { Todo } from "./interfaces";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stateTodo, setStateTodo] = useState<Todo>({
    id: null,
    title: "",
    completed: false,
    description: "",
    createdAt: "",
  });
  useEffect(() => {
    const data = localStorage.getItem("todos");
    if (data) {
      const parsedData = (JSON.parse(data) || []) as Todo[];
      setTodos(parsedData);
    }
  }, []);

  function addTodo() {
    const newTodo: Todo = {
      id: todos.length + 1,
      title: stateTodo.title,
      completed: false,
      description: stateTodo.description,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
    localStorage.setItem("todos", JSON.stringify([...todos, newTodo]));
    setStateTodo({
      id: null,
      title: "",
      completed: false,
      description: "",
      createdAt: "",
    });
  }
  function removeTodo(id: number) {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    localStorage.setItem("todos", JSON.stringify([...filteredTodos]));
  }
  function toggleTodo(id: number) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify([...updatedTodos]));
  }
  function editTodo() {
    const updatedTodos = todos.map((todo) =>
      todo.id === stateTodo.id
        ? {
            ...todo,
            title: stateTodo.title,
            description: stateTodo.description,
          }
        : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify([...updatedTodos]));
    setStateTodo({
      id: null,
      title: "",
      completed: false,
      description: "",
      createdAt: "",
    });
  }
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        gap: 24,
      }}
    >
      <TodoList
        removeTodo={removeTodo}
        setStateTodo={setStateTodo}
        todos={todos}
        toggleTodo={toggleTodo}
      ></TodoList>
      <div style={{ borderLeft: "1px solid black" }}></div>
      <div style={{ margin: 12 }}>
        <TodoForm
          addTodo={addTodo}
          editTodo={editTodo}
          stateTodo={stateTodo}
          setStateTodo={setStateTodo}
        ></TodoForm>
      </div>
    </div>
  );
}

export default App;
