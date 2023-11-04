import React, { useEffect, useState } from 'react'
import styles from './StoriesContainer.module.scss'

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';

import { CircularProgress } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { openSnackbar,setStories} from '../../state'
import CreateStoryModal from './createStoryModal/CreateStoryModal';
import Story from './story/Story';

const StoriesContainer = () => {
  const dispatch=useDispatch();
  const axiosPrivate=useAxiosPrivate();
  const [openCreateStoryModal,setOpenCreateStoryModal]=useState(false);
  const [newStoryCreated,setNewStoryCreated]=useState(false);
  const [hasMoreStories, setHasMoreStories] = useState(true);

  const currentUser=useSelector((state)=>state.currentUser);
  const token=useSelector((state)=>state.token);
  const stories=useSelector(state=>state.stories);

  const limit=5;

  const getTimelineStories = async () => {
    let pageNo=Math.ceil(stories.length/limit)+1;
    try {
        const res=await axiosPrivate.get(`/stories/timeline/${currentUser._id}/all?page=${pageNo}&limit=${limit}`);
        const mergedStories=[...stories,...res.data];
        dispatch(setStories({
            stories:mergedStories
        }));
        if(res.data.length===0){
            setHasMoreStories(false);
        }
    }catch (error) {
      console.log(error);
      dispatch(openSnackbar({message:"Failed to Fetch Timeline Stories",severity:"error"}));
    }
  };
  useEffect(() => {
    return()=>{
        getTimelineStories();
    }
  }, []);

  const fetchMoreData = () => {
    getTimelineStories();
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.secondWrapper}>
        <div id="scrollableStoriesDiv" className={styles.storyContainer}>
          <InfiniteScroll
            dataLength={stories.length}
            next={fetchMoreData}
            hasMore={hasMoreStories}
            loader={<CircularProgress/>}
            //endMessage={<h4>You have reached the end</h4>}
            style={{ display: 'flex', alignItems: 'center', gap:'20px',height:"100%",width:"100%" }}
            scrollableTarget="scrollableStoriesDiv"
          >
            <div className={styles.createPost} onClick={()=>setOpenCreateStoryModal(true)}>
            <AddBoxRoundedIcon sx={{color:"aqua",fontSize:"35px"}}/>
            <span className='primaryText'>Create Story</span>
          </div>
          {stories.map((story,index)=>(<Story key={index} story={story} currentUser={currentUser} newStoryCreated={newStoryCreated}/>))}
          </InfiniteScroll>
        </div>
      </div>
      {openCreateStoryModal && <CreateStoryModal openCreateStoryModal={openCreateStoryModal} setOpenCreateStoryModal={setOpenCreateStoryModal} currentUser={currentUser} setNewStoryCreated={setNewStoryCreated}/>}
    </div>
  )
}

export default StoriesContainer