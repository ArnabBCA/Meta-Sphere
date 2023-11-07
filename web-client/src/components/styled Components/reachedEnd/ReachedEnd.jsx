import React from 'react'
import styles from './ReachedEnd.module.scss'

import EndIcon from '../../../assets/NoMoreData.png'

const ReachedEnd = () => {
  return (
    <div className={styles.reachedEndContainer}>
        <img src={EndIcon} alt="" />
        <span className='primaryText'>You've seen all posts</span>
    </div>
  )
}

export default ReachedEnd