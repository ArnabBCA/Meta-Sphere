import React, { useState } from 'react'
import styles from './CommentBox.module.scss'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useSelector,useDispatch } from 'react-redux';
import { openSnackbar } from '../../../state';
import useMoment from '../../../utils/useMoment'
import StyledIconButton from '../../styled Components/CustomIconButton';

const CommentBox = ({post,posts,setPosts,commentCount}) => {
    const dispatch=useDispatch();
    const axiosPrivate=useAxiosPrivate();
    const currentUser=useSelector((state)=>state.currentUser);

    const [comment,setComment]=useState('');

    const [noOfComments,setNoOfComments]=useState(1);
    let leftComments=commentCount-noOfComments;

    const sortedComments = [...post.comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const slice = sortedComments.slice(0, noOfComments);
    const loadMoreComments=()=>{
        if(noOfComments>=commentCount) return;
        setNoOfComments(noOfComments+2);
    }

    const sendComment=async()=>{
        if(!comment) return;
        try {
            const res=await axiosPrivate.put(`/posts/${post._id}/comment`,{
                userId: currentUser._id,
                text:comment,
            });
            setPosts(posts.map((p)=>p._id===post._id ? res.data : p));

            dispatch(openSnackbar({message:"Comment Added",severity:"success"}));
            setComment('');
        } catch (error) {
            console.log(error);
            dispatch(openSnackbar({message:"Failed to Add Comment",severity:"error"}));
        }
    }
  return (
    <div className={styles.commentBox}>
        <div className={styles.inputContainer}>
            <div className={`${styles.inputBox} wigetSecondary`}>
                {currentUser.profilePicture && <img src={currentUser.profilePicture.url} alt="" />}
                <input type="text" className='primaryText' placeholder='Comment ...' onChange={(e)=>setComment(e.target.value)} value={comment} name='comment'/>
                <StyledIconButton onClick={sendComment} icon={<SendIcon/>} />
            </div>
        </div>
        {slice.map((comment)=>(
            <div className={styles.commentContainer} key={comment._id}>
                <img src={comment.profilePicture} alt="" />
                <div className={styles.commentInfo}>
                    <div className={styles.timeBox}>
                        <span className='secondaryText'>{comment.userName}</span>
                        <span className='secondaryText'>{useMoment(comment.createdAt)}</span>
                    </div>
                    <span className='primaryText'>{comment.text}</span>
                </div>
            </div>
        ))}
        <div className={styles.postControles}>
            {commentCount===0 
                ? <span className='secondaryText'>No Comments</span> 
                    : leftComments<=0 
                        ? <span className='secondaryText'>No more comments</span> 
                            : <span onClick={loadMoreComments} className='secondaryText'>View {leftComments} more comments ...</span>}
            <StyledIconButton onClick={()=>setNoOfComments(1)} icon={<ExpandLessIcon/>}/>
        </div>
    </div>
  )
}

export default CommentBox