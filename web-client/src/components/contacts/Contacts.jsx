import React, { useEffect, useState } from 'react'
import styles from './Contacts.module.scss'
import NoProfilePic from '../../assets/account.png'

import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import WigetWrapper from '../styled Components/wiget wrapper/WegetWrapper'
import FollowUser from '../action buttons/FollowUser'

const Contacts = () => {
    const axiosPrivate=useAxiosPrivate();
    const currentUser=useSelector((state)=>state.currentUser);

    const [following, setFollowing] = useState([]);

    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const limit=5;

    let pageNo=Math.ceil(following.length/limit)+1;

    const followingUsers=async()=>{
        try {
            const res = await axiosPrivate.get(`/users/following/${currentUser._id}?page=${pageNo}&limit=${limit}`)
            const mergedUsers=[...following,...res.data];
            setFollowing(mergedUsers);
            if(res.data.length===0){
                setHasMoreUsers(false);
            }
          } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        return()=>{
            followingUsers();
        }
    },[])
    const fetchMoreData = () => {
        followingUsers();
    };
  return (
    <WigetWrapper>
        <span className='primaryText' style={{fontSize:"16px"}}>Contacts</span>
        <div id='scrollableFollowingDiv' className={styles.contactsContainer}>
            <InfiniteScroll
                dataLength={following.length}
                next={fetchMoreData}
                hasMore={hasMoreUsers}
                loader={<CircularProgress/>}
                style={{ display: 'flex', flexDirection:"column", alignItems: 'center',width:"100%", gap:'20px'}}
                scrollableTarget="scrollableFollowingDiv"
            >
                {hasMoreUsers || following.length>0 ?(
                    following.map((user) => (
                        <div className={styles.contact} key={user.userId}>
                            <div className={styles.contactInfo}>
                                <img src={user.profilePicture ? user.profilePicture : NoProfilePic} alt="User Profile" />
                                <div className={styles.userInfo}>
                                    <span className='primaryText'>@{user.userName}</span>
                                    <span className='secondaryText'>{user.fullName}</span>
                                </div>
                            </div>
                            <div className={styles.contactActions}>
                                <FollowUser userId={user.userId} currentUser={currentUser} />
                            </div>
                        </div>
                    ))
                ) : (
                    <span style={{fontSize:"14px"}} className='secondaryText'>No User Found</span>
                )}
            </InfiniteScroll>
        </div>
    </WigetWrapper>
  )
}

export default Contacts