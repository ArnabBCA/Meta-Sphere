import React from 'react'
import styles from './Sponsor.module.scss'

import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SponsorImage from '../../assets/social-media.jpg'

import WegetWrapper from '../styled Components/wiget wrapper/WegetWrapper'
import StyledIconButton from '../styled Components/CustomIconButton'

import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../state';

const Sponsor = () => {
    const dispatch=useDispatch();
    const handleDummyClick=()=>{
        dispatch(openSnackbar({message:"This is a dummy component",severity:"info"}));
    }
  return (
    <WegetWrapper>
        <div className={styles.sponsorCoontainer}>
            <span className='primaryText'>Sponsored</span>
            <img src={SponsorImage} alt="" />
            <div className={styles.actionButtons}>
                <div className={styles.like}>
                    <StyledIconButton icon={<FavoriteIcon/>} onClick={handleDummyClick}/>
                    <StyledIconButton icon={<CommentIcon/>} onClick={handleDummyClick}/>
                </div>
                <StyledIconButton icon={<ShareIcon/>} onClick={handleDummyClick}/>
            </div>
        </div>
    </WegetWrapper>
  )
}

export default Sponsor