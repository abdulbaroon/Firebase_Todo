"use client"
import { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "@/config/firebase";
import { Box, Button, TextField } from "@mui/material";

// Import firebase configuration from firebase.ts file

const TodoForm = () => {
  const db = getDatabase(app);

  const [title, setTitle] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const addTodo = () => {
  const todoRef = ref(db, "/todos");
  const todo = {
    title,
    done: false,
  };
  push(todoRef, todo);
  };

  return (
    <Box>
      <TextField id="outlined-basic" label="Outlined" variant="outlined"  onChange={handleChange} />
      <Button type="submit" onClick={addTodo}>
        Submit
      </Button>
    </Box>
  )
}

export default TodoForm;