import React, { useState } from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import styles from './Post.module.scss';
import { useSelector} from 'react-redux';
import CommentBox from '../action buttons/commentBox/CommentBox';
import moment from 'moment';
import StyledIconButton from '../styled Components/CustomIconButton';
import PostLike from '../action buttons/postLike/PostLike';
import PostDelete from '../action buttons/postDelete/PostDelete';
import PostShare from '../action buttons/postShare/PostShare';
import PostEdit from '../action buttons/postEdit/PostEdit'
import FollowUser from '../action buttons/FollowUser';
import NoProfilePic from '../../assets/account.png';
import WegetWrapper from '../styled Components/wiget wrapper/WegetWrapper';

const HomeCenterFeed = ({ post, postSection }) => {
  
  if (!post) return null;

  const theme=useSelector((state)=>state.theme);
  const token=useSelector((state)=>state.token);
  const currentUser=useSelector((state)=>state.currentUser);

  const [shareOpen, setShareOpen] = useState(false);
  const handlleShareOpen = () => {
    setShareOpen(true);
    setTimeout(() => {
      setShareOpen(false);
    }, 5000);
  };

  return (
    <WegetWrapper>
      {postSection && <span>Vital Posts</span>} {/* for viral post section */}
      <div className={styles.feedUserContainer}>
        <div className={styles.postUserInfo}>
          <img src={post.profilePicture ? post.profilePicture : NoProfilePic} alt="" />
          <div className={styles.userProfileInfo}>
            <div className={styles.timeBox}>
              <span className='primaryText'>@{post.userName}</span>
              <span className='secondaryText'>{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className={styles.location}>
              <span className='secondaryText'>{post.fullName}</span>
              {<span className='secondaryText' ><PlaceIcon className={`${styles.spanLocationIcon}`} />Pandua</span>}
            </div>
          </div>
        </div>
        <div className={styles.postActionsButtons}>
          {post.creatorId === currentUser._id && <PostEdit post={post} currentUser={currentUser} token={token}/>}  {/* for edit */}
          {post.creatorId === currentUser._id && <PostDelete post={post} currentUser={currentUser} token={token}/>} {/* for delete */}
          {post.creatorId != currentUser._id && <FollowUser userId={post.creatorId} currentUser={currentUser} token={token}/>}  {/* for follow */}
        </div>
      </div>
      {post.desc && <span className={`${styles.postDesc} primaryText`}>{post.desc}</span>}
      {post.image && <img className={styles.postImage} src={post.image.url} alt="" />}
      <div className={styles.postLikeOptions}>
        <div className={styles.postLikeBox}>
          <div className={styles.option}>
            <PostLike post={post} currentUser={currentUser} token={token}/>   {/* for like */}
            <span>{post.likes.length}</span>
          </div>
          <div className={styles.option}>
            <StyledIconButton icon={<CommentIcon/>}/>
            <span>{post.comments.length}</span>
          </div>
        </div>
        <StyledIconButton onClick={handlleShareOpen} icon={<ShareIcon/>}/>
      </div>
      {shareOpen && <PostShare post={post} theme={theme}/>} {/* for share */}
      <CommentBox post={post} commentCount={post.comments.length}/> {/* for comment */}
    </WegetWrapper>
  );
};

export default HomeCenterFeed;