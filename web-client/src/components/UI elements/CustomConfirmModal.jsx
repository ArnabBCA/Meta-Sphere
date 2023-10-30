import React from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StyledIconButton from './CustomIconButton';
import styles from './CustomConfirmModal.module.scss'
const CustomConfirmModal = ({setOpenConfirmModal,setConfirmation}) => {
    const handleModal=()=>{
        setOpenConfirmModal(false);
    }
    const haldleConfirm=()=>{
        setConfirmation(true);
        setOpenConfirmModal(false);
    }
  return (
    <div className={styles.modalBackground}>
        <div className={styles.confirmModal}>
            <span>Deleted Post Cannot be Retrived</span>
            <div className={styles.modalAction}>
                <button type='button' onClick={handleModal}>Cancel</button>
                <button type='button' onClick={haldleConfirm}>Delete</button>
            </div>
        </div>
    </div>
  )
}

export default CustomConfirmModal