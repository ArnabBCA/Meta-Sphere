import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'
import useMediaQuery from '@mui/material/useMediaQuery';

import Navbar from '../../components/navbar/Navbar'
import Profile from '../../components/profile/Profile'
import Contacts from '../../components/contacts/Contacts'
import PostInput from '../../components/post input/PostInput'
import StoriesContainer from '../../components/storiesContainer/StoriesContainer'
import SuggestedUsers from '../../components/suggestedUsers/SuggestedUsers'
import Post from '../../components/post/Post'
import ReachedEnd from '../../components/styled Components/reachedEnd/ReachedEnd';

import { useDispatch, useSelector } from 'react-redux'
import { setPosts,openSnackbar } from '../../state'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
    const dispatch=useDispatch();
    const axiosPrivate=useAxiosPrivate();

    const medium = useMediaQuery('(min-width:1100px)');
    const small = useMediaQuery('(min-width:750px)');
    
    const {_id}=useSelector(state=>state.currentUser);
    const posts=useSelector(state=>state.posts);
    const [postsIds,setPostsIds]=useState([]);

    const [hasMorePosts, setHasMorePosts] = useState(true);
    const limit=2;

    const getTimelinePosts = async () => {
        let pageNo=Math.ceil(posts.length/limit)+1;
        try {
            const res=await axiosPrivate.post(`/posts/timeline/${_id}/all?page=${pageNo}&limit=${limit}`,{
              postsIds:postsIds,
            });
            const mergedPosts=[...posts,...res.data];
            dispatch(setPosts({
                posts:mergedPosts
            }));
            setPostsIds(mergedPosts.map(post=>post._id));
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
      <div className={styles.home}>
        {small && <div className={`${styles.left} ${styles.homeContainer}`}>
          <Profile/>
          <Contacts/>
        </div>}
        <div id='scrollCenterDiv' className={`${styles.center} ${styles.homeContainer}`}>
          <StoriesContainer/>
          <PostInput/>
          {!medium && <div className={styles.suggestedUsersContainer}>
            <SuggestedUsers/>
          </div>}
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMorePosts}
            loader={<CircularProgress/>}
            endMessage={<ReachedEnd/>}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',gap:'30px' }}
            scrollableTarget="scrollCenterDiv"
          >
            {posts.map((post)=>(<Post key={post._id} post={post}/>))}
          </InfiniteScroll>
        </div>
        {medium && 
          <div className={`${styles.right} ${styles.homeContainer}`}>
            <SuggestedUsers/>
          </div>
        }
      </div>
    </>
  )
}

export default Home