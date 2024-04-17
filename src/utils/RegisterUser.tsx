import { app } from "@/config/firebase";
import { UserCredential } from "firebase/auth";
import { getDatabase, push, ref } from "firebase/database";

 const RegisterUser=(user:UserCredential,userName?:string)=>{
    const userData = user.user
    const db = getDatabase(app);
    const notificationRef = ref(db,"/users");
    const notification= {
        userName:userData.displayName||userName,
        uId:userData.uid,
        userType:"Guest",
        userEmail:userData.email,
        userStatus:true
    }
    push(notificationRef,notification)
}

export default RegisterUser