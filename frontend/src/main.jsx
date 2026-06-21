
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import UserContext from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
 <AuthProvider>
   <UserContext>
    <App />
   </UserContext>
 </AuthProvider>
)
