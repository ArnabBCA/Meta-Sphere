import React, { useEffect, useState } from 'react'
import styles from './StoriesSliderModal.module.scss'

import Stories from 'react-insta-stories';
import axios from 'axios';

import Slides from './Slides';

const StoriesSliderModal = ({ story,setAllSlidesSeen, setOpenStoriesSliderModal, currentUser, token }) => {

  const [slideId,setSlideId]=useState(null);
  const hadleSeenStory=async()=>{
    if(story.storySlides[story.storySlides.length-1]._id===slideId){
      setAllSlidesSeen(true);
    }
    try{
        const res=await axios.put(`http://localhost:5000/api/stories/${slideId}/seen`, {
          userId: currentUser._id,
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          },
        });
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);
  return (
    <div className={styles.storiesSliderModalBackground}>
      <div className={styles.storiesSlider}>
        <Stories onAllStoriesEnd={()=>setOpenStoriesSliderModal(false)} onStoryStart={hadleSeenStory}  height={"100%"} width={"100%"} stories={story.storySlides.map((stories) => ({
          content: ({ action, isPaused, }) => (
            <Slides stories={stories} story={story} setOpenStoriesSliderModal={setOpenStoriesSliderModal} setSlideId={setSlideId}/>
          ),
        }))}/>
      </div>
    </div>
  )
}

export default StoriesSliderModal;
