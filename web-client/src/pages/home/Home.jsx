import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'
import useMediaQuery from '@mui/material/useMediaQuery';

import Navbar from '../../components/navbar/NavBar'
import Profile from '../../components/profile/Profile'
import Contacts from '../../components/contacts/Contacts'
import PostInput from '../../components/post input/PostInput'
import StoriesContainer from '../../components/storiesContainer/StoriesContainer'
import SuggestedUsers from '../../components/suggestedUsers/SuggestedUsers'

import Sponsor from '../../components/sponsor/Sponsor';
import Feed from '../../components/feed/Feed';
import { useSelector } from 'react-redux';

const Home = () => {
    const medium = useMediaQuery('(min-width:1100px)');
    const small = useMediaQuery('(min-width:750px)');
    const [newPostCreated,setNewPostCreated]=useState(null);
    
    const currentUser=useSelector(state=>state.currentUser);

  return (
    <div>
      <Navbar />
      <div className={styles.home}>
        {small && <div className={`${styles.left} ${styles.homeContainer}`}>
          <Profile userId={currentUser._id}/>
          <Contacts userId={currentUser._id}/>
        </div>}
        <div id='scrollCenterDiv' className={`${styles.center} ${styles.homeContainer}`}>
          <StoriesContainer/>
          <PostInput setNewPostCreated={setNewPostCreated}/>
          {!medium && <div className={styles.suggestedUsersContainer}>
            <SuggestedUsers/>
          </div>}
          <Feed page={"timeline"} userId={currentUser._id} newPostCreated={newPostCreated} setNewPostCreated={setNewPostCreated}/>
        </div>
        {medium && 
          <div className={`${styles.right} ${styles.homeContainer}`}>
            <Sponsor/>
            <SuggestedUsers/>
          </div>
        }
      </div>
    </div>
  )
}

export default Home