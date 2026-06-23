import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom';

import React from 'react'
import { useAuth } from '../context/AuthProvider';

function PublicRoutes() {
  const {accessToken , loading} = useAuth()
    if(loading) return <div>loading...</div>
    return accessToken ? <Navigate to="/feed" />: <Outlet/> 
}

export default PublicRoutes