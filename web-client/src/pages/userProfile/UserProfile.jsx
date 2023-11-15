import React from 'react'
import styles from './UserProfile.module.scss'

import Navbar from '../../components/navbar/NavBar'
import Profile from '../../components/profile/Profile'
import { useParams } from 'react-router-dom'
import Contacts from '../../components/contacts/Contacts'
import { useMediaQuery } from '@mui/material'
import Feed from '../../components/feed/Feed'
const UserProfile = () => {
    const { userId } = useParams();
    const small = useMediaQuery('(min-width:750px)');

  return (
    <div key={userId}>
        <Navbar/>
        <div className={styles.profile}>
            {small && <div className={`${styles.left} ${styles.profileContainer}`}>
                <Profile userId={userId}/>
                <Contacts userId={userId}/>
            </div>}
            <div id='scrollCenterDiv' className={`${styles.right} ${styles.profileContainer}`}>
                {!small && <Profile userId={userId}/>}
                <Feed userId={userId}/>
            </div>
        </div>
    </div>
  )
}

export default UserProfile