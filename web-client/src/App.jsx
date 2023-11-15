import React, { useEffect } from 'react'
import './App.css'
import './theme.scss'
import { BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux';
import { closeSnackbar } from './state';

import Auth from './pages/auth/Auth';
import Home from "./pages/home/Home"
import UserProfile from './pages/userProfile/UserProfile';
import Explore from './pages/explore/Explore';

import CustomScackbar from './components/styled Components/CustomSnackbar';
import PersistLogin from './pages/auth/PersistLogin';

function App() {
  const token=Boolean(useSelector((state)=>state.token));
  const theme=useSelector((state)=>state.theme);
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);
  
  return (
      <BrowserRouter>
        <Routes>
          <Route>
            <Route element={<PersistLogin/>}>
              <Route path='/' element={token?<Home/>:<Navigate to="/login"/>}/>
              <Route path='/profile/:userId' element={token?<UserProfile/> :<Navigate to="/login"/>}/>
              <Route path='/explore' element={token ? <Explore/> :<Navigate to="/login"/>}/>
            </Route>
            <Route path="/:page" element={<Auth/>}/>
          </Route>
        </Routes>
        <CustomScackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={()=>dispatch(closeSnackbar())}/>
      </BrowserRouter>
  )
}

export default App