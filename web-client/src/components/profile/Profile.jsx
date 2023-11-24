import React, { useEffect, useState } from 'react'
import styles from './Profile.module.scss'

import NoProfilePic from '../../assets/account.png'
import EditIcon from '@mui/icons-material/Edit';
import PlaceIcon from '@mui/icons-material/Place';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

import { useSelector,useDispatch } from 'react-redux';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';

import { updateCurrentUser,openSnackbar } from '../../state';
import StyledIconButton from '../styled Components/CustomIconButton';
import WigetWrapper from '../styled Components/wiget wrapper/WegetWrapper';
import ProfileModal from './profileModal/ProfileModal';


const Profile = ({userId}) => {
  const theme=useSelector((state)=>state.theme);

  const dispatch = useDispatch();
  const currentUser=useSelector((state)=>state.currentUser);
  const axiosPrivate=useAxiosPrivate();

  const [user,setUser]=useState({});
  const [profileModal,setProfileModal]=useState(false);

  const getUserProfileData = async () => {
    try {
      const res = await axiosPrivate.get(`/users/${userId}`)
      setUser(res.data);
    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({message:"Failed To fetch Current User",severity:"error"}));
    }
  };
  useEffect(() => {
    getUserProfileData();
  }, []);
  return (
    <WigetWrapper>
        <div className={styles.userInfo}>
            <div className={styles.profile}>
                <Link to={`/profile/${user._id}`}>
                    <img src={user.profilePicture ? user.profilePicture.url : NoProfilePic} alt=""/>
                </Link>
                <div className={styles.profileInfo}>
                    <Link className="primaryText" to={`/profile/${user._id}`}>@{user.userName}</Link>
                    <span className={"secondaryText"}>{user.fullName}</span>
                </div>
            </div>
            {currentUser._id === userId && <StyledIconButton icon={<EditIcon/>} onClick={()=>setProfileModal(true)}/>}  {/* for current user only*/}
        </div>
            <div className={"horizontalHr"+theme}></div>
            <div className={styles.userDetails}>
                <div className={styles.userDetailsInfo}>
                    <PlaceIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>{user.location ? user.location : "Location"}</span>
                </div>
                <div className={styles.userDetailsInfo}>
                    <WorkOutlineIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>{user.occupation ? user.occupation : "Ocuupation"}</span>
                </div>
            </div>
            <div className={"horizontalHr"+theme}></div>
            <div className={styles.postDetails}>
                <div className={styles.postDetailsInfo}>
                    <span className={"primaryText"}>{user.posts ? user.posts.length :"0"}</span>
                    <span className={"secondaryText"}>Post</span>
                </div>
                <div className={"verticalHr"+theme}></div>
                <div className={styles.postDetailsInfo}>
                    <span className={"primaryText"}>{user.followers ? user.followers.length :"0"}</span>
                    <span className={"secondaryText"}>Followers</span>
                </div>
                <div className={"verticalHr"+theme}></div>
                <div className={styles.postDetailsInfo}>
                    <span className={"primaryText"}>{user.following ? user.following.length : "0"}</span>
                    <span className={"secondaryText"}>Following</span>
                </div>
            </div>
            <div className={"horizontalHr"+theme}></div>
            <div className={styles.socials}>
                <div className={styles.socialLink}>
                    <InstagramIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>{user.socialLink1 ? user.socialLink1 : "Social Link 1"}</span>
                </div>
                <div className={styles.socialLink}>
                    <FacebookIcon className={"primaryText"}/>
                    <span className={"secondaryText"}>{user.socialLink2 ? user.socialLink2 : "Social Link 2"}</span>
                </div>
            </div>
            <div className={"horizontalHr"+theme}></div>
            <Link to={`/profile/${user._id}`} className={styles.viewProfile}>View Profile</Link>
            {profileModal && <ProfileModal setProfileModal={setProfileModal} userId={userId}/>}
    </WigetWrapper>
  )
}

export default Profile