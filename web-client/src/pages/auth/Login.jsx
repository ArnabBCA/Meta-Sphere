import React, {  useState } from 'react'
import styles from './Auth.module.scss'

import axios from 'axios'
import { useNavigate,Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import CircularProgress from '@mui/material/CircularProgress';

import { openSnackbar, setLogin } from '../../state'
import { loginSchema } from '../../schemas/Schemas'
import { initialValues } from '../../schemas/Schemas'
import VerifyOTP from './VerifyOTP'

const Login = () => {
    const { page } = useParams();
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const [verifyPage,setVerifyPage]=useState(false);
    const [loading,setLoading]=useState(false);

    const {values,errors,touched,handleBlur,handleChange,handleSubmit,resetForm}=useFormik({
        initialValues:initialValues,
        validationSchema:loginSchema,
        onSubmit : async (values)=>{
            try {
                setLoading(true);
                axios.defaults.withCredentials = true;
                const res=await axios.post('http://localhost:5000/api/auth/login',{
                    email:values.email,
                    password:values.password
                })
                dispatch(setLogin({
                    currentUser:res.data.currentUser,
                    token:res.data.token
                }));
                setLoading(false);
                resetForm();
                dispatch(openSnackbar({message:"Loggedin Successfully",severity:"success"}));
                navigate('/');
            } catch (error) {
                setLoading(false);
                console.log(error);
                if(error.response.data.message ==="Email not Verified"){
                    setVerifyPage(true);
                }
                dispatch(openSnackbar({message:`${error.response.data.message}`,severity:"error"}));
            }
        }
    });
  return (
    <div className={styles.register_login_Container}>
        <span>{verifyPage ? "Verify" :"Login"}</span>
        {verifyPage ? <VerifyOTP email={values.email} resetForm={resetForm} currentPage={page}/>:
        <div className={styles.formContainer}>
            <form action="" onSubmit={handleSubmit}>
                <div className={styles.inputBox}>
                    <input type="email" autoComplete='off' name='email' placeholder='Email' value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                    { errors.email && touched.email  ? <span className={styles.error}>{errors.email}</span> : null}
                </div>
                <div className={styles.inputBox}>
                    <input type="password" autoComplete='off' name='password' placeholder='Password' value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                    { errors.password && touched.password  ? <span className={styles.error}>{errors.password}</span> : null}
                </div>
                <button type='submit'> {loading ? <CircularProgress size={24}/> : "Login"}</button>
            </form>
            <span>Don't have a account? <Link to="/register">Register</Link></span>
        </div>}
    </div>
  )
}

export default Login