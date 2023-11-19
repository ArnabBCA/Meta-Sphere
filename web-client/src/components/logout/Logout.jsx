import React, { useState } from 'react';
import styles from './Logout.module.scss';

import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../state';

import ModalWrapper from '../styled Components/modal wrapper/ModalWrapper';

const Logout = ({setOpenLogoutModal}) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const currentUser = useSelector((state) => state.currentUser);
  const [loading,setLoading]=useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/logout',{
          userId: currentUser._id,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(setLogout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }finally{
        setLoading(false);
    }
  }; 
  return (
    <ModalWrapper>
      <div className={styles.modalHeader}>
        <span className='primaryText'>You are about to be Logged Out</span>
      </div>
      <div className={styles.modalAction}>
        <button type='button' onClick={()=>setOpenLogoutModal(false)}>Cancel</button>
        <button type='button' onClick={handleLogout}>{loading ? <CircularProgress size={20}/> : "Logout"}</button>
      </div>
    </ModalWrapper>
  )
};

export default Logout;

