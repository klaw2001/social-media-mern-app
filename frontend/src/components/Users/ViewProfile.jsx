import React from 'react'
import GetPost from '../Posts/GetPost'
import UserWithEditProfile from './UserWithEditProfile'
import ProfileTabs from './ProfileTabs'
const ViewProfile = () => {
  return (
    <div>
      <UserWithEditProfile/>
      <ProfileTabs/>
    </div>
  )
}

export default ViewProfile