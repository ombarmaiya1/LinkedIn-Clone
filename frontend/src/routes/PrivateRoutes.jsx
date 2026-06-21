import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { Outlet,Navigate } from 'react-router-dom';

function PrivateRoutes() {
  
    const {userData , loading} = useContext(UserDataContext);
    if(loading) return <div>loading...</div>
    return userData ? <Outlet/> : <Navigate to="/login" />
}

export default PrivateRoutes