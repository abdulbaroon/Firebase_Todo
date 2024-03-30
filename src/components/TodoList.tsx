"use client"
import { useContext, useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, set, } from "firebase/database";
import { Todo } from "@/types/todo";
import { app } from "@/config/firebase";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Close, Delete, Edit, Save } from "@mui/icons-material";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { AuthContext } from "@/context/auth-context";
import dayjs from "dayjs";
import { toast } from "sonner";

const TodoList = () => {
    const db = getDatabase(app);
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        console.log(`/todos-${currentUser ? currentUser.uid : ""}`, currentUser)
        const todoRef = ref(db, `/todos-${currentUser ? currentUser.uid : ""}`);

        onValue(todoRef, (snapshot) => {
            const todos = snapshot.val();
            const newTodoList: Todo[] = [];
            console.log(todos, "s")
            for (let id in todos) {
                newTodoList.push({ id, ...todos[id] });
            }

            setTodoList(newTodoList);
        });
    }, [db, currentUser]);

    return (
        <div className="m-10">
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>ID</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>Name</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>created Date</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>Due Date</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>status</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todoList?.map((todo) => (
                            <TableRow key={todo.id}>
                                <TodoRow todo={todo} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const TodoRow = ({ todo }: { todo: Todo }) => {
    const [editMode, setEditMode] = useState(false);
    const [tittle, setTitle] = useState(todo.title);
    const [createDate, setCreateDate] = useState(todo.current_date);
    const [dueDate, setDueDate] = useState(todo.due_date);
    const db = getDatabase(app);
    const { currentUser } = useContext(AuthContext)
    function toggleEditMode() {
        setEditMode((prev) => !prev);
    }

    useEffect(() => {
        const cell = document.getElementById(todo.id);
        if (cell && editMode) {
            cell.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(cell, 1);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [editMode, todo.id]);

    function handleDelete() {
        const todoRef = ref(db, `/todos-${currentUser ? currentUser.uid : ""}/${todo.id}`);
        remove(todoRef)
            .then(() => {
                console.log("Todo deleted successfully");
                toast.success("Todo Deleted")
            })
            .catch((error) => {
                toast.error("Error" + error?.message)
                console.error("Error deleting todo: ", error);
            });
    }

    function handleDone() {
        const todoRef = ref(db, `/todos-${currentUser ? currentUser.uid : ""}/${todo.id}`);
        const updatedTodo = { ...todo, done: true };
        set(todoRef, updatedTodo)
            .then(() => {
                console.log("Todo updated successfully");
                toast.success("Todo marked as Done");
            })
            .catch((error) => {
                toast.error("Error: " + error?.message);
                console.error("Error updating todo: ", error);
            });
    }

    function handleUpdate() {
        const todoRef = ref(db, `/todos-${currentUser ? currentUser.uid : ""}/${todo.id}`);
        const updatedTodo = {
            ...todo,
            title: tittle,
            current_date: createDate,
            due_date: dueDate,
        }
        set(todoRef, updatedTodo)
            .then(() => {
                toggleEditMode()
                toast.success("Todo Updated successfully");
            })
            .catch((error) => {
                toast.error("Error: " + error?.message);
                console.error("Error updating todo: ", error);
            });
    }

    function handleTitle(event: React.FormEvent<HTMLTableCellElement>) {
        setTitle(event.currentTarget.innerText);
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(event.currentTarget, 1);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
    }
    function handleCurrentDate(event: React.FormEvent<HTMLTableCellElement>) {
        setCreateDate(event.currentTarget.innerText);
    }
    function handleDueDate(event: React.FormEvent<HTMLTableCellElement>) {
        setDueDate(event.currentTarget.innerText);
    }
    return (
        <>
            <TableCell suppressContentEditableWarning>
                {todo.id}
            </TableCell>
            <TableCell contentEditable={editMode} suppressContentEditableWarning id={todo.id} onInput={handleTitle}>
                {tittle}
            </TableCell>
            <TableCell contentEditable={false} suppressContentEditableWarning onInput={handleCurrentDate}>
                {dayjs(createDate).format('DD/MM/YYYY')}
            </TableCell>
            <TableCell contentEditable={false} suppressContentEditableWarning onInput={handleDueDate}>
                {dayjs(dueDate).format('DD/MM/YYYY')}
            </TableCell>
            <TableCell suppressContentEditableWarning>
                <div className={`border ${todo.done ? "bg-green-500" : "bg-red-400"} text-center rounded-lg`} >
                    <p className="text-base TEXT-">{`${todo.done ? "Completed" : "Incomplete"}`} </p>
                </div>
            </TableCell>
            <TableCell>
                {!editMode && (
                    <IconButton size="small" onClick={handleDone} >
                        <DoneOutlineIcon />
                    </IconButton>
                )}
                {!editMode && <IconButton size="small" onClick={toggleEditMode}>
                    {<Edit />}
                </IconButton>}
                {editMode && (
                    <IconButton size="small" sx={{ mr: 2 }} onClick={handleUpdate}>
                        <Save />
                    </IconButton>
                )}
                {!editMode && (
                    <IconButton size="small" sx={{ mr: 2 }} onClick={handleDelete}>
                        <Delete />
                    </IconButton>
                )}
                {editMode && (
                    <IconButton size="small" onClick={toggleEditMode}>
                        <Close />
                    </IconButton>
                )}
            </TableCell>
        </>
    );
};

export default TodoList;
