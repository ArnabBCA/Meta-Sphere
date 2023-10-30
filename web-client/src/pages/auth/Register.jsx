import React, { useRef, useState } from 'react'
import styles from './Register.module.scss'
import EarthCanvas from '../../components/globe/Globe'
import { Link, useNavigate } from 'react-router-dom'
import colors from './material-colors.json';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../state';
import { registerSchema } from '../../schemas/Schemas';
import axios from 'axios';
import VerifyOTP from './VerifyOTP';
const Register = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [image, setImage] = useState(null);
    const [verify,setVerify]=useState(false);

    const initialValues={
        userName:"",
        fullName:"",
        email:"",
        password:"",
        confirmPassword:"",
    }

    function generateAvatar(username) {
        const colorNames = Object.keys(colors);
        const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];
        const shades = colors[randomColorName];
        const shadeNames = Object.keys(shades);
        const randomShadeName = shadeNames[Math.floor(Math.random() * shadeNames.length)];
        
        // Create an avatar image (e.g., initials in a colored circle)
        const avatarCanvas = document.createElement('canvas');
        avatarCanvas.width = 100;
        avatarCanvas.height = 100;
        const ctx = avatarCanvas.getContext('2d');
        ctx.fillStyle = shades[randomShadeName];
        ctx.beginPath();
        ctx.arc(50, 50, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff'; // Text color
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      
        // Split the username into first name and middle name
        const names = username.trim().split(' ');
        if (names.length >= 2) {
          // Display the initials of both first name and middle name
          const initials = names[0][0].toUpperCase() + names[1][0].toUpperCase();
          ctx.fillText(initials, 50, 53);
        } 
        else {
          // Display the initials of the single name
          const initials = names[0][0].toUpperCase();
          ctx.fillText(initials, 50, 53);
        }
        // Convert the canvas to an image or store it as needed
        const avatarImage = avatarCanvas.toDataURL();
        setImage(avatarImage);
    }
    const handleChangeName=(e)=>{
        if(e.target.value!==""){
            generateAvatar(e.target.value);
        }
    }
    const {values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue,resetForm}=useFormik({
        initialValues:initialValues,
        validationSchema:registerSchema,
        onSubmit : async (values)=>{
            console.log(values);
            //resetForm();
            try{
                const res = await axios.post(`http://localhost:5000/api/auth/signup`, {
                    userName:values.userName,
                    fullName:values.fullName,
                    email:values.email,
                    password:values.password,
                    profilePicture:image,
                });
                console.log(image);
                setVerify(true);
                dispatch(openSnackbar({message:"Verification Email Sent",severity:"success"}));
                //resetForm();
                //navigate('/login');
            }catch(error){
                dispatch(openSnackbar({message:`${error.response.data.message}`,severity:"error"}));
            }
        }
    });

  return (
    <div className={styles.registerBackground}>
        <div className={styles.register}>
            <EarthCanvas/>
            <div className={styles.registerContainer}>
                <div className={styles.logo}>
                    <span>{verify?"Verify":"Register"}</span>
                </div>
                <div className={styles.formContainer}>
                        {verify 
                        ? 
                            <VerifyOTP email={values.email} resetForm={resetForm}/>
                        :
                        <form onSubmit={handleSubmit}>
                        <div className={styles.inputBox}>
                            <input type="text" autoComplete='off' name='userName' placeholder='User Name' value={values.userName} onChange={(e) => {handleChange(e);handleChangeName(e);}} onBlur={handleBlur}/>
                            {errors.userName && touched.userName ? <span className={styles.error}>{errors.userName}</span> : null}
                        </div>
                        <div className={styles.inputBox}>
                            <input type="text" autoComplete='off' name='fullName' placeholder='Full Name' value={values.name} onChange={(e) => {handleChange(e);handleChangeName(e);}} onBlur={handleBlur}/>
                            {errors.fullName && touched.fullName ? <span className={styles.error}>{errors.fullName}</span> : null}
                        </div>
                        <div className={styles.inputBox}>
                            <input type="email" autoComplete='off' name='email' placeholder='Email' value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                            { errors.email && touched.email  ? <span className={styles.error}>{errors.email}</span> : null}
                        </div>
                        <div className={styles.inputBox}>
                            <input type="password" autoComplete='off' name='password' placeholder='Password' value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                            { errors.password && touched.password  ? <span className={styles.error}>{errors.password}</span> : null}
                        </div>
                        <div className={styles.inputBox}>
                            <input type="password" autoComplete='off' name='confirmPassword' placeholder='Confirm Password' value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}/>
                            { errors.confirmPassword && touched.confirmPassword  ? <span className={styles.error}>{errors.confirmPassword}</span> : null}
                        </div>
                        <button type='submit'>SignUp</button>
                    </form>}
                    <span>Already have a account? <Link to="/login">Login</Link></span>
                </div>
            </div>
        </div>
    </div> 
  )
}

export default Register