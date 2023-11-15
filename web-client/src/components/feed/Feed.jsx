import React, { useEffect, useState, useRef } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from '../../state';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReachedEnd from '../styled Components/reachedEnd/ReachedEnd';
import { CircularProgress } from '@mui/material';

import Post from './post/Post';
import Masonry from 'react-masonry-css'

const Feed = ({ page, userId, newPostCreated, setNewPostCreated }) => {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const currentUser = useSelector((state) => state.currentUser);
  const [posts, setPosts] = useState([]);
  const [postsIds, setPostsIds] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const screenHeightRef = useRef(window.innerHeight);
  let limit;
  if(page==="explore"){
    limit=9;
  }
  else{
    limit=Math.ceil(screenHeightRef.current / 325);
  }

  const getTimelinePosts = async () => {
    let pageNo = Math.ceil(posts.length / limit) + 1;
    try {
      let path;
      if(page==="explore"){
        path=`/posts/explore?page=${pageNo}&limit=${limit}`;
      }
      if(page==="profile"){
        path=`/posts/user/${userId}?page=${pageNo}&limit=${limit}`;
      }
      if(page==="timeline"){
        path=`/posts/timeline/${currentUser._id}/all?page=${pageNo}&limit=${limit}`;
      }
    
      const res = await axiosPrivate.post(path, {
        postsIds: postsIds,
      });
      let mergedPosts;
      if (newPostCreated) {
        setPostsIds([newPostCreated._id, ...postsIds]);
        mergedPosts = [newPostCreated, ...posts];
        setNewPostCreated(null);
      } else {
        mergedPosts = [...posts, ...res.data];
      }
      setPosts(mergedPosts);
      setPostsIds(mergedPosts.map((post) => post._id));
      if (res.data.length<limit) {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({ message: 'Failed to Fetch Timeline Posts', severity: 'error' }));
    }
  };

  useEffect(() => {
    getTimelinePosts();
  }, [newPostCreated]);

  const fetchMoreData = () => {
    getTimelinePosts();
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
    500: 1
  };
  
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMoreData}
      hasMore={hasMorePosts}
      loader={<CircularProgress />}
      endMessage={<ReachedEnd />}
      style={{ display: 'flex',  flexDirection: 'column', alignItems:"center", gap: '30px' }}
      scrollableTarget={'scrollCenterDiv'}
    >
      {page!="explore" && posts.map((post) => (
        <Post key={post._id} post={post} posts={posts} setPosts={setPosts} />
      ))}
      
      {page==="explore" && <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {posts.map((post) => (
            <Post key={post._id} post={post} posts={posts} setPosts={setPosts}/>
        ))}
      </Masonry>}
    </InfiniteScroll>
  );
};

export default Feed;
