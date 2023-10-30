import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'

import Navbar from '../../components/navbar/Navbar'
import Profile from '../../components/profile/Profile'
import Contacts from '../../components/contacts/Contacts'
import PostInput from '../../components/post input/PostInput'
import StoriesContainer from '../../components/storiesContainer/StoriesContainer'
import SuggestedUsers from '../../components/suggestedUsers/SuggestedUsers'
import Post from '../../components/post/Post'

import { useDispatch, useSelector } from 'react-redux'
import { setPosts,openSnackbar } from '../../state'

import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Home = () => {
  const dispatch=useDispatch();
  const axiosPrivate=useAxiosPrivate();

    const {_id}=useSelector(state=>state.currentUser);
    const token=useSelector((state)=>state.token);
    const posts=useSelector(state=>state.posts);

    const [hasMorePosts, setHasMorePosts] = useState(true);
    const limit=2;

    const getTimelinePosts = async () => {
        let pageNo=Math.ceil(posts.length/limit)+1;
        try {
            const res=await axiosPrivate.get(`/posts/timeline/${_id}/all?page=${pageNo}&limit=${limit}`,{
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            const mergedPosts=[...posts,...res.data];
            dispatch(setPosts({
                posts:mergedPosts
            }));
            if(res.data.length===0){
                setHasMorePosts(false);
            }
        } catch (error) {
            console.log(error);
            dispatch(openSnackbar({message:"Failed to Fetch Timeline Posts",severity:"error"}));
        }
    };
    useEffect(() => {
        return()=>{
            getTimelinePosts();
        }
    }, []);

    const fetchMoreData = () => {
        getTimelinePosts();
    };
  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <div className={styles.homeLeft}>
          <Profile/>
          <Contacts/>
        </div>
        <div className={styles.homeCenter}>
          <StoriesContainer/>
          <PostInput/>
          <div className={styles.suggestedUsersContainer}>
            <SuggestedUsers/>
          </div>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMorePosts}
            loader={<CircularProgress/>}
            endMessage={<h4>You have reached the end</h4>}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',gap:'30px' }}
          >
            {posts.map((post)=>(<Post key={post._id} post={post}/>))}
          </InfiniteScroll>
        </div>
        <div className={styles.homeRight}>
          <SuggestedUsers/>
        </div>
      </div>
    </>
  )
}

export default Home