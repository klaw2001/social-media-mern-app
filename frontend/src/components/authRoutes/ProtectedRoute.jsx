import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import Home from '../Main/Home'
import AppDrawer from '../Main/AppDrawer'
const ProtectedRoute = () => {
    const auth = localStorage.getItem('token')
    console.log(auth)
  return (
    <div>
        {
            auth?
            <>
                <AppDrawer/>
            </>
            : <Navigate to='/login'/>
        }
    </div>
  )
}

export default ProtectedRoute