import React, { useEffect, useState } from 'react'
import styles from './Story.module.scss'

import NoprofilePic from '../../../assets/account.png';

import StoriesSliderModal from '../storiesSliderModal/StoriesSliderModal';

const Story = ({story,currentUser,token,newStoryCreated}) => {
    const [openStoriesSliderModal,setOpenStoriesSliderModal]=useState(false);
    const [allSlidesSeen,setAllSlidesSeen]=useState(false);

    const handleAllSlidesSeen = () => {
      const isAllSlidesSeen = story.storySlides.every(storyItem => {
        return storyItem.isSeenBy && storyItem.isSeenBy.includes(currentUser._id);
      });
      setAllSlidesSeen(isAllSlidesSeen);
    };
    useEffect(() => {
      handleAllSlidesSeen();
    }, [newStoryCreated]);      
  return (
    <>
    <div onClick={()=>setOpenStoriesSliderModal(true)} className={`${styles.story}`}>
      <div className={`${styles.ring} ${allSlidesSeen ? "notActive"  : styles.active}`}>
            <img className='navbarBackground' src={story.profilePicture ? story.profilePicture : NoprofilePic} alt="" />
      </div>
      <span className='secondaryText'>@{story.userName}</span>
    </div>
    {openStoriesSliderModal && <StoriesSliderModal setAllSlidesSeen={setAllSlidesSeen} story={story} setOpenStoriesSliderModal={setOpenStoriesSliderModal} currentUser={currentUser} token={token}/>}
    </>
  )
}

export default Story