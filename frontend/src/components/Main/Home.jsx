import React from 'react'
import AppDrawer from './AppDrawer'
import EditProfile from '../Users/ViewProfile'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        {/* <AppDrawer/> */}
        <Outlet/>
    </div>
  )
}

export default Home