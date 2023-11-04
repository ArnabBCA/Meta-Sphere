import React, { useEffect, useState } from 'react'
import styles from './Contacts.module.scss'
import FollowUser from '../action buttons/FollowUser'
import { useSelector } from 'react-redux'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material'
import WigetWrapper from '../styled Components/wiget wrapper/WegetWrapper'
import NoProfilePic from '../../assets/account.png'
const Contacts = () => {
    const axiosPrivate=useAxiosPrivate();
    const token=useSelector((state)=>state.token);
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
        <InfiniteScroll
            dataLength={following.length}
            next={fetchMoreData}
            hasMore={hasMoreUsers}
            //loader={<CircularProgress/>}
            height={1}
            //endMessage={<h4>You have reached the end</h4>}
            style={{ display: 'flex', flexDirection:"column",maxHeight:"300px", alignItems: 'center', gap:'20px',height:"100%"}}
            //scrollableTarget="scrollableFollowingDiv"
        >
            {following.length > 0 ? (
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
                            <FollowUser userId={user.userId} currentUser={currentUser} token={token} />
                        </div>
                    </div>
                ))
            ) : (
                <span style={{fontSize:"14px"}} className='secondaryText'>No User Found</span>
            )}
        </InfiniteScroll>
    </WigetWrapper>
  )
}

export default Contacts