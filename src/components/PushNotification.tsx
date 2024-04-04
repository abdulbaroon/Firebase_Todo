import { app } from '@/config/firebase';
import { AuthContext } from '@/context/auth-context';
import dayjs from 'dayjs';
import { getDatabase, push, ref } from 'firebase/database';
import React, { useContext } from 'react'

const PushNotification = (message:string) => {
    const db = getDatabase(app);
    const { currentUser } = useContext(AuthContext  )
    if(currentUser){
        const notificationRef = ref(db,"/notifications");
        const notification= {
            message:message ,
            current_date: dayjs(new Date()).format('MM/DD/YYYY')

        }
        push(notificationRef,notification)
    }



}

export default PushNotification