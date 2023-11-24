import React, { useEffect } from 'react'
import styles from './Slides.module.scss'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlaceIcon from '@mui/icons-material/Place';
import NoProfilePic from '../../../assets/account.png'

import { IconButton } from '@mui/material';
import useMoment from '../../../utils/useMoment';

const Slides = ({stories,story,setOpenStoriesSliderModal,setSlideId}) => {
  useEffect(() => {
    setSlideId(stories._id);
  }, [])
  return (
    <div className={styles.storyBackground} style={{ background: `linear-gradient(to right, ${stories.gradient.color1}, ${stories.gradient.color2})` }}>
      {stories.image && <img className={styles.backgroundImage} src={stories.image.url} alt="" />}
      <div className={styles.storyHeader}>
        <div className={styles.userInfo}>
          <img src={story.profilePicture ? story.profilePicture : NoProfilePic} alt="" />
          <div className={styles.userBio}>
            <span>@{story.userName}<span className={styles.time}>{useMoment(stories.createdAt)}</span></span>
            <span>{story.fullName}{<span className={styles.location}><PlaceIcon style={{fontSize:"14px"}}/>Pandua</span>}</span>
          </div>
        </div>
        <IconButton onClick={() => setOpenStoriesSliderModal(false)}sx={{":hover, &.Mui-focusVisible":{backgroundColor:"white",color:"var(--darktextSeconadry)"},color:"white"}}>
          <CloseRoundedIcon/>
        </IconButton>
      </div>
      <div className={styles.text}>
        <span>{stories.desc}</span>
        <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="instagram">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo"></feColorMatrix>
              <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  )
}

export default Slides