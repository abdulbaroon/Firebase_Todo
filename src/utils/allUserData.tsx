import { app } from "@/config/firebase";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

const allUsersData=()=>{
  const [allUsers, setAllUsers] = useState<any[]>([])
  const db = getDatabase(app);
 useEffect(() => { 
        const userRef = ref(db, `/users`);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            const newUsers:any[]= [];
            for (let id in users) {
              newUsers.push({ id, ...users[id] });
            }
            setAllUsers(newUsers);
        });
  }, [db]);
  return allUsers
}
export {allUsersData}
