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
import PushNotification from "../utils/PushNotification";
import { Users } from "@/types/users";


const TodoList = () => {
    const db = getDatabase(app);
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const { currentUser } = useContext(AuthContext)
    const [users, setUsers] = useState<Users>();


    useEffect(() => {
        const userRef = ref(db, `/users`);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            const newUsers: any[] = [];
            for (let id in users) {
                newUsers.push({ id, ...users[id] });
            }
            const newUser=newUsers.find((flr)=>flr.uId===currentUser?.uid)
            setUsers(newUser);
        });
    }, [db, currentUser]);

    useEffect(() => { 
        if(currentUser){
            const todoRef = ref(db, `/todos`);
            onValue(todoRef, (snapshot) => {
                const todos = snapshot.val();
                console.log(todos,"sd");
                const newTodoList: Todo[] = [];
                for (let id in todos) {
                    newTodoList.push({ id, ...todos[id] });
                }
                const newTodoLists=newTodoList?.filter((ftr)=>ftr.uId===currentUser?.uid || (users?.userType==='Admin'))
                setTodoList(newTodoLists);
            });
        }
    }, [db, currentUser,users]);

    return (
        <div className=" m-0 md:m-10">
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>ID</Typography>
                            </TableCell>
                            <TableCell component={"th"} sx={{width:"35%"}}>
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
                            <TableCell component={"th"} sx={{width:"20%"}}>
                                <Typography fontWeight={"bold"}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todoList?.map((todo,index) => (
                            <TableRow key={todo.id}>
                                <TodoRow todo={todo} indexs={index} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const TodoRow = ({ todo , indexs }: { todo: Todo , indexs:number}) => {
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
        const todoRef = ref(db, `/todos/${todo.id}`);
        remove(todoRef)
            .then(() => {
                console.log("Todo deleted successfully");
                toast.success("Todo Deleted")
                PushNotification("Todo Deleted by "+currentUser?.displayName,currentUser?.uid)

            })
            .catch((error) => {
                toast.error("Error" + error?.message)
                console.error("Error deleting todo: ", error);
            });
    }

    function handleDone() {
        const todoRef = ref(db, `/todos/${todo.id}`);
        const updatedTodo = { ...todo, done: true };
        set(todoRef, updatedTodo)
            .then(() => {
                console.log("Todo updated successfully");
                toast.success("Todo marked as Done");
                PushNotification("todo Mark as Done by "+currentUser?.displayName,currentUser?.uid)

            })
            .catch((error) => {
                toast.error("Error: " + error?.message);
                console.error("Error updating todo: ", error);
            });
    }

    function handleUpdate() {
        const todoRef = ref(db, `/todos/${todo.id}`);
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
               PushNotification("todo Updted by "+currentUser?.displayName,currentUser?.uid)
                
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
                {indexs +1 }
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
                <div className={`border w-28 ${todo.done ? "bg-green-500" : "bg-red-400"} text-center rounded-lg`} >
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
