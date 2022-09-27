import logo from "./logo.svg";
import "./App.css";
import {
  withAuthenticator,
  Button as Btn,
  Heading,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import axios from "axios";
const baseURL =
  "https://n7b6konlaj.execute-api.us-east-1.amazonaws.com/prod/crud-basic-lambda";

function App({ signOut, user }) {
  const [todos, setTodos] = useState([]);
  const getData = async () => {
    const { data } = await axios.get(
      `https://n7b6konlaj.execute-api.us-east-1.amazonaws.com/prod/crud-basic-lambda`
    );
    console.log(data.Items);
    const processedArray = data.Items.map((item) =>
      JSON.parse(item.item)
    ).filter((item) => item !== null);
    console.log(processedArray);
    setTodos(processedArray);
  };

  useEffect(() => {
    getData();
  }, []);

  const addTodo = (text) => {
    const todoToAdd = {
      text,
      isDone: false,
      loggedBy: user.username,
    };
    axios.post(baseURL, JSON.stringify(todoToAdd)).then((res) => {
      console.log(res);
    });
    const newTodos = [
      ...todos,
      { text: text, loggedBy: user.username, isDone: false },
    ];
    setTodos(newTodos);
  };
  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };
  const markTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    setTodos(newTodos);
  };

  return (
    <div className="App">
      <div className="app">
        <div className="container">
          <h1 className="text-center mb-4">Todo List</h1>
          <FormTodo addTodo={addTodo} />
          <div>
            AA
            {todos &&
              todos.map((todo, index) => (
                <Card>
                  <Card.Body>
                    <Todo
                      key={index}
                      index={index}
                      todo={todo}
                      markTodo={markTodo}
                      removeTodo={removeTodo}
                    />
                  </Card.Body>
                </Card>
              ))}
          </div>
        </div>
      </div>
      <Heading level={1}>Hello {user.username}</Heading>
      <Btn onClick={signOut}>Sign out</Btn>
    </div>
  );
}
function Todo({ todo, index, markTodo, removeTodo }) {
  console.log(todo);
  return (
    <div className="todo">
      <span style={{ textDecoration: todo.isDone ? "line-through" : "" }}>
        <p>TODO: {todo.text}</p>
        <p>LoggedBy: {todo.loggedBy}</p>
      </span>
      <div>
        <Button variant="outline-success" onClick={() => markTodo(index)}>
          ✓
        </Button>{" "}
        <Button variant="outline-danger" onClick={() => removeTodo(index)}>
          ✕
        </Button>
      </div>
    </div>
  );
}
function FormTodo({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>
          <b>Add Todo</b>
        </Form.Label>
        <Form.Control
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add new todo"
        />
      </Form.Group>
      <Button variant="primary mb-3" type="submit">
        Submit
      </Button>
    </Form>
  );
}
export default withAuthenticator(App);
