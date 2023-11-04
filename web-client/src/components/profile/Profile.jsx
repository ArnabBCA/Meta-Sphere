import React, { useEffect } from 'react'
import styles from './Profile.module.scss'

import NoProfilePic from '../../assets/account.png'
import EditIcon from '@mui/icons-material/Edit';
import PlaceIcon from '@mui/icons-material/Place';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

import { useSelector,useDispatch } from 'react-redux';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { updateCurrentUser,openSnackbar } from '../../state';
import StyledIconButton from '../styled Components/CustomIconButton';
import WigetWrapper from '../styled Components/wiget wrapper/WegetWrapper';

const Profile = ({profileModal, setProfileModal}) => {
  const theme=useSelector((state)=>state.theme);

  const dispatch = useDispatch();
  const axiosPrivate=useAxiosPrivate();
  
  const token=useSelector((state)=>state.token);
  const currentUser=useSelector((state)=>state.currentUser);

  const getCurrentUser = async () => {
    try {
      const res = await axiosPrivate.get(`/users/${currentUser._id}`)
      dispatch(updateCurrentUser({
        currentUser:res.data,
      }));
    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({message:"Failed To fetch Current User",severity:"error"}));
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <WigetWrapper>
        <div className={styles.userInfo}>
            <div className={styles.profile}>
                {currentUser.profilePicture ? <img src={currentUser.profilePicture.url} alt=""/> : <img src={NoProfilePic} alt=""/>}
                <div className={styles.profileInfo}>
                    <span className={"primaryText"}>@{currentUser.userName}</span>
                    <span className={"secondaryText"}>{currentUser.fullName}</span>
                </div>
            </div>
            <StyledIconButton icon={<EditIcon/>} onClick={()=>setProfileModal(true)}/>
        </div>
            <div className={"horizontalHr"+theme}></div>
            <div className={styles.userDetails}>
                <div className={styles.userDetailsInfo}>
                    <PlaceIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>Location</span>
                </div>
                <div className={styles.userDetailsInfo}>
                    <WorkOutlineIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>Occupation</span>
                </div>
            </div>
            <div className={"horizontalHr"+theme}></div>
            <div className={styles.postDetails}>
                <div className={styles.postDetailsInfo}>
                    <span className={"primaryText"}>10</span>
                    <span className={"secondaryText"}>Post</span>
                </div>
                <div className={"verticalHr"+theme}></div>
                <div className={styles.postDetailsInfo}>
                    <span className={"primaryText"}>54</span>
                    <span className={"secondaryText"}>Followers</span>
                </div>
                <div className={"verticalHr"+theme}></div>
                <div className={styles.postDetailsInfo}>
                    <span className={"primaryText"}>375</span>
                    <span className={"secondaryText"}>Following</span>
                </div>
            </div>
            <div className={"horizontalHr"+theme}></div>
            <div className={styles.socials}>
                <div className={styles.socialLink}>
                    <InstagramIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>arnab_ghosh_gg</span>
                </div>
                <div className={styles.socialLink}>
                    <FacebookIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>Arnab Ghsoh</span>
                </div>
            </div>
            <div className={"horizontalHr"+theme}></div>
            <span className={styles.viewProfile}>View Profile</span>
    </WigetWrapper>
  )
}

export default Profile