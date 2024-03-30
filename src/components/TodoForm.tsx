'use client'
import React, { useContext, useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "@/config/firebase";
import { TextField, Button } from "@mui/material";
import { AuthContext } from "@/context/auth-context";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { toast } from "sonner";

const TodoForm = () => {
    const db = getDatabase(app);
    console.log()

    const [title, setTitle] = useState("");
    const { currentUser } = useContext(AuthContext)
    const [value, setValue] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const addTodo = () => {
        if(!title){
            toast.error('Fill the Task Name');
        }
        else if (currentUser) {
            const todoRef = ref(db, `/todos-${currentUser ? currentUser.uid : ""}`);
            const todo = {
                title,
                done: false,
                due_date: value?.toISOString()||dayjs(new Date())?.toISOString() ,
                current_date: dayjs(new Date())?.toISOString()

            };
            push(todoRef, todo);
            toast.success('Todo Created');
        }
        else{
             toast.error('First Login');
        }
    };

    return (
        <div className="flex justify-center mt-10 items-center gap-3">
            <TextField id="outlined-basic" label="Task Name" variant="outlined"  sx={{}} onChange={handleChange} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Select Date" value={value} onChange={(newValue) => setValue(newValue as dayjs)} />
            </LocalizationProvider>
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={addTodo}>
                Submit
            </Button>
        </div>
    );
}

export default TodoForm;