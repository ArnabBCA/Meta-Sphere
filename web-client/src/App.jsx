import React, { useEffect } from 'react'
import './App.css'
import './theme.scss'
import { BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux';
import { closeSnackbar } from './state';

import Home from "./pages/home/Home"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import CustomScackbar from './components/styled Components/CustomSnackbar';

import PersistLogin from './pages/auth/PersistLogin';

function App() {
  const isAuth=Boolean(useSelector((state)=>state.token));
  const theme=useSelector((state)=>state.theme);
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  useEffect(() => {
    const body = document.body;
    body.className = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);
  
  return (
      <BrowserRouter>
        <Routes>
          <Route>
            <Route element={<PersistLogin/>}>
              <Route path='/' element={isAuth?<Home/>:<Navigate to="/login"/>}/>
            </Route>
            <Route path="/login"  element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
          </Route>
        </Routes>
        <CustomScackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={()=>dispatch(closeSnackbar())}/>
      </BrowserRouter>
  )
}

export default App