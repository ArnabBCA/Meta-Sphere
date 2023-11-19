import React, { useState } from 'react'
import styles from './DeletePostModal.module.scss'

import CircularProgress from '@mui/material/CircularProgress';

import ModalWrapper from '../../styled Components/modal wrapper/ModalWrapper';

const DeletePostModal = ({setOpenDeletePostModal,handleDelete}) => {
    const [loading,setLoading]=useState(false);
    const haldleConfirm=async()=>{
        try {
            setLoading(true);
            await handleDelete();
        } catch (error) {
           console.log(error);
        }
        finally{
            setLoading(false);
        }
        setOpenDeletePostModal(false);
    }
  return (
    <ModalWrapper width={"400px"} setModalOpen={setOpenDeletePostModal}>
        <div className={styles.modalHeader}>
            <span className='primaryText'>Deleted Post Cannot be Retrived</span>
        </div>
            <div className={styles.modalAction}>
                <button type='button' onClick={()=>setOpenDeletePostModal(false)}>Cancel</button>
                <button type='button' onClick={haldleConfirm}>{loading ? <CircularProgress size={20}/> : "Delete"}</button>
            </div>
    </ModalWrapper>
  )
}

export default DeletePostModal