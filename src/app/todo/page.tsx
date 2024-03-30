"use client"
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import dynamic from 'next/dynamic'
import { SnackbarProvider } from 'notistack'
import React from 'react'

const page = () => {
  return (
    <>
     <SnackbarProvider maxSnack={3}>
    <TodoForm/>
    <TodoList/>
    </SnackbarProvider>
    </>
  )
}

export default dynamic(() => Promise.resolve(page), { ssr: false })