import React, { useEffect, useState } from 'react'
import styles from './SuggestedUsers.module.scss'

import NoProfilePic from '../../assets/account.png'

import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

import FollowUser from '../action buttons/FollowUser';

const SuggestedUsers = () => {
    const token=useSelector((state)=>state.token);
    const currentUser=useSelector((state)=>state.currentUser);
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const limit=5;
    let pageNo=Math.ceil(suggestedUsers.length/limit)+1;

    const getSuggestedUsers=async()=>{
        try {
            const res = await axios.get(`http://localhost:5000/api/users/suggested/${currentUser._id}?page=${pageNo}&limit=${limit}`, {
              headers: {
                Authorization: 'Bearer ' + token
              },
            })
            const mergedUsers=[...suggestedUsers,...res.data];
            setSuggestedUsers(mergedUsers);
          } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        return()=>{
            getSuggestedUsers();
        }
    },[])
    const fetchMoreData = () => {
        getSuggestedUsers();
    };

  return (
    <div className={styles.suggestionContainer}>
        <span className='primaryText'>Suggested Users</span>
        <div id='scrollableSuggestedUserDiv' className={styles.suggestionSlider}>
        <InfiniteScroll
            dataLength={suggestedUsers.length}
            next={fetchMoreData}
            hasMore={hasMoreUsers}
            //loader={<CircularProgress/>}
            //endMessage={<h4>You have reached the end</h4>}
            style={{ display: 'flex', alignItems: 'center', gap:'20px',height:"100%"}}
            scrollableTarget="scrollableSuggestedUserDiv"
        >
            {suggestedUsers.map((user) => (
                <div className={`${styles.userCard} wigetPrimary`} key={user._id}>
                    <img src={user.profilePicture ? user.profilePicture.url : NoProfilePic} alt="" />
                    <div className={styles.userInfo}>
                        <span className='primaryText'>@{user.userName}</span>
                        <span className='secondaryText'>{user.fullName}</span>
                    </div>
                    <FollowUser userId={user._id} currentUser={currentUser} token={token}/>
                </div>
            ))}
        </InfiniteScroll>
        </div>
    </div>
  )
}

export default SuggestedUsers