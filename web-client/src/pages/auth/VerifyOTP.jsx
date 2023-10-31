import React, { useState, useRef } from 'react';
import styles from './Auth.module.scss';

import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../state';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const VerifyOTP = ({ email, resetForm ,currentPage }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);

  // Create refs for each input field
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Update the OTP array with the new value
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
    // Move focus to the next input field if the current input is not empty
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleSendEmail = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/sendotp', {
        email: 'arnabsonu2@gmail.com',
      });
      dispatch(openSnackbar({ message: `${res.data.message}`, severity: 'success' }));
    } catch (error) {
      dispatch(openSnackbar({ message: `${error.response.data.message}`, severity: 'error' }));
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.join('').length !== 4) return;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify', {
        email: email,
        otp: otp.join(''),
      });
      setOtp(['', '', '', '']);
      resetForm();
      if(currentPage==="register"){
        navigate('/login');
      }
      else{
        navigate('/');
      }
      dispatch(openSnackbar({ message: `${res.data.message}`, severity: 'success' }));
    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({ message: `${error.response.data.message}`, severity: 'error' }));
    }
  };

  return (
    <div className={styles.otpContainer}>
      <span>A OTP was sent to your Email</span>
      <div className={styles.inputContainer}>
        {otp.map((value, index) => (
          <input key={index}
            type="text"
            name="otp"
            maxLength="1"
            value={value}
            onChange={(e) => handleInputChange(e, index)}
            ref={inputRefs[index]}
          />
        ))}
      </div>
      <div className={styles.actionButtons}>
        <button onClick={handleSendEmail}>Resend</button>
        <button onClick={handleVerifyOTP}>Verify</button>
      </div>
      {currentPage === "register"  ? <span>Already have a account? <Link to="/login">Login</Link></span> :<span>Don't have a account? <Link to="/register">Signup</Link></span>}
    </div>
  );
};

export default VerifyOTP;

