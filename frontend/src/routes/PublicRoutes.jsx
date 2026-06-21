import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom';

import React from 'react'

function PublicRoutes() {
  const {userData , loading} = useContext(UserDataContext);
    if(loading) return <div>loading...</div>
    return userData ? <Navigate to="/feed" />: <Outlet/> 
}

export default PublicRoutes