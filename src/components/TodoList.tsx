"use client"
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

// Import firebase configuration from firebase.ts file
import { Todo } from "@/types/todo";
import { app } from "@/config/firebase";



const TodoList = () => {
  const db = getDatabase(app);

  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    const todoRef = ref(db, "/todos");
    
    onValue(todoRef, (snapshot) => {
      const todos = snapshot.val();
      const newTodoList: Todo[] = [];

      for (let id in todos) {
        newTodoList.push({ id, ...todos[id] });
      };

      setTodoList(newTodoList);
    });
  }, [db]);

  return (
    <div>
      <h1>Todo List</h1>
      {todoList.map((todo, index) => {
        return <p key={index}>{todo.title}</p>;
      })}
    </div>
  )
}

export default TodoList;