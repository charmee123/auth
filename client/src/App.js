import React from 'react'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'

/** import all components */
import Login from './components/Login';
import Password from './components/Password';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';

/** Root routes */
const router = createBrowserRouter([
    {
        path: '/',
        element : <Login></Login>
    },
    {
        path: '/signup',
        element : <Signup></Signup>
    },
    {
        path: '/password',
        element : <Password></Password>
    },
    {
        path: '/reset',
        element : <Reset></Reset>
    },
    {
        path: '/profile',
        element : <Profile></Profile>
    },
    {
        path: '/recovery',
        element : <Recovery></Recovery>
    },
    {
        path: '*',
        element : <PageNotFound></PageNotFound>
    }
])

export default function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
       
  )
}

