import React from 'react'
import styles from './WigetWrapper.module.scss'
const WegetWrapper = ({children}) => {
  return (
    <div className={`${styles.wigetWrapper} wigetPrimary`}>
        {children}
    </div>
  )
}

export default WegetWrapper