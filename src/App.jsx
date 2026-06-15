import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { API_URL } from "./config";

export default function App() {
  const { state, signIn, signOut, getAccessToken } = useAuthContext();

  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  // Call the backend with the Asgardeo access token as a Bearer header.
  async function api(path, options = {}) {
    const token = await getAccessToken();
    const res = await fetch(API_URL + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("HTTP " + res.status + ": " + text);
    }
    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return null;
    }
    return res.json();
  }

  async function loadTodos() {
    try {
      const data = await api("/todos");
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (state.isAuthenticated) {
      loadTodos();
    }
  }, [state.isAuthenticated]);

  async function addTodo(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/todos", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          description: description,
          end_date: endDate || null,
          completed: false
        })
      });
      setName("");
      setDescription("");
      setEndDate("");
      loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTodo(todo) {
    setError("");
    try {
      await api("/todos/" + todo.id, {
        method: "PUT",
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      });
      loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(id) {
    setError("");
    try {
      await api("/todos/" + id, { method: "DELETE" });
      loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!state.isAuthenticated) {
    return (
      <div>
        <h1>Todo</h1>
        <button onClick={() => signIn()}>Sign in with Asgardeo</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Todo</h1>
      <p>
        Signed in as {state.username}{" "}
        <button onClick={() => signOut()}>Sign out</button>
      </p>

      {error ? <p style={{ color: "red" }}>Error: {error}</p> : null}

      <form onSubmit={addTodo}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
            <b>{todo.name}</b> - {todo.description}
            {todo.end_date ? " (due " + todo.end_date + ")" : ""}{" "}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
