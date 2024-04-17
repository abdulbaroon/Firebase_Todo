import { Users } from '@/types/users';
import { create } from 'zustand';

interface TodoStoreState {
    user: Users|string;
    storeUsers: (str: Users) => void;
}

export const useTodoStore = create<TodoStoreState>((set) => ({
    user:"",
    storeUsers: (str) => set({ user: str }),
}));