import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // GET API
  useEffect(() => {
    async function getTodos() {
      try {
        const response = await fetch(
          "https://dummyjson.com/todos"
        );

        const data = await response.json();
        setTodos(data.todos);
      } catch (error) {
        console.log("GET Error:", error);
      }
    }

    getTodos();
  }, []);

  // POST API - Add Todo
  async function addTodo() {
    if (!input.trim()) return;

    try {
      const response = await fetch(
        "https://dummyjson.com/todos/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            todo: input,
            completed: false,
            userId: 1
          })
        }
      );

      const data = await response.json();

      setTodos([...todos, data]);
      setInput("");

    } catch (error) {
      console.log("POST Error:", error);
    }
  }

  // PUT API - Replace entire Todo
  async function updateTodo(id) {
    const newTask = prompt("Enter updated task:");

    if (!newTask || !newTask.trim()) return;

    try {
      const response = await fetch(
        `https://dummyjson.com/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            todo: newTask,
            completed: false,
            userId: 1
          })
        }
      );

      const data = await response.json();

      setTodos(
        todos.map((item) =>
          item.id === id ? data : item
        )
      );

    } catch (error) {
      console.log("PUT Error:", error);
    }
  }

  // PATCH API - Update only completed status
  async function toggleTodo(id, completed) {
    try {
      const response = await fetch(
        `https://dummyjson.com/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            completed: !completed
          })
        }
      );

      const data = await response.json();

      setTodos(
        todos.map((item) =>
          item.id === id ? { ...item, ...data } : item
        )
      );

    } catch (error) {
      console.log("PATCH Error:", error);
    }
  }

  // DELETE API
  async function deleteTodo(id) {
    try {
      await fetch(
        `https://dummyjson.com/todos/${id}`,
        {
          method: "DELETE"
        }
      );

      setTodos(
        todos.filter((item) => item.id !== id)
      );

    } catch (error) {
      console.log("DELETE Error:", error);
    }
  }

  return (
    <div>
      <h1>Todo Application</h1>

      <input
        type="text"
        placeholder="Enter your task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={addTodo}>Add Todo</button>

      <h2>Todo List</h2>

      {todos.map((item) => (
        <div key={item.id}>

          <input
            type="checkbox"
            checked={item.completed}
            onChange={() =>
              toggleTodo(item.id, item.completed)
            }
          />

          <span
            style={{
              textDecoration: item.completed
                ? "line-through"
                : "none"
            }}
          >
            {item.todo}
          </span>

          <button onClick={() => updateTodo(item.id)}>
            Edit (PUT)
          </button>

          <button onClick={() => deleteTodo(item.id)}>
            Delete
          </button>

          <p>
            {item.completed ? "Completed" : "Pending"}
          </p>

        </div>
      ))}
    </div>
  );
}

export default App;