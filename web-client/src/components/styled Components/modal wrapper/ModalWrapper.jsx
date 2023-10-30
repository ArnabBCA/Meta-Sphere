import React, { useEffect } from 'react'
import styles from './ModalWrapper.module.scss'

const ModalWrapper = ({children,width,setModalOpen}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className={styles.modalBackdrop} onClick={()=>setModalOpen(false)}>
        <div className={`${styles.modalWrapper} wigetPrimary`} style={{width}} onClick={(e)=>e.stopPropagation()}>
            {children}
        </div>
    </div>
  )
}

export default ModalWrapper