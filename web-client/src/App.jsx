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
import FindPost from './pages/findPost/FindPost';

function App() {
  const token=Boolean(useSelector((state)=>state.token));
  const theme=useSelector((state)=>state.theme);
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch(closeSnackbar())
  };
  
  return (
      <BrowserRouter>
        <Routes>
          <Route>
            <Route element={<PersistLogin/>}>
              <Route path='/' element={token?<Home/>:<Navigate to="/auth/login"/>}/>
              <Route path='/profile/:userId' element={token?<UserProfile/> :<Navigate to="/auth/login"/>}/>
              <Route path='/explore' element={token ? <Explore/> :<Navigate to="/auth/login"/>}/>
              <Route path='/post/:postId' element={token ? <FindPost/> :<Navigate to="/auth/login"/>}/>
            </Route>
            <Route path="/auth/:page" element={<Auth/>}/>
          </Route>
        </Routes>
        <CustomScackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleClose}/>
      </BrowserRouter>
  )
}

export default App