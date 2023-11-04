import React from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch } from 'react-redux';
import { setPost,openSnackbar } from '../../../state';
import StyledIconButton from '../../styled Components/CustomIconButton';

const PostLike = ({post,currentUser}) => {
    const dispatch=useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const handleLike=async()=>{
      try {
        const res = await axiosPrivate.put(`/posts/${post._id}/like`, {
          userId: currentUser._id,
        });
        dispatch(setPost({post:res.data}));
      } catch (error) {
        console.log(error);
        dispatch(openSnackbar({message:"Failed to Like Post",severity:"error"}));
      }
    }
  return (
    <StyledIconButton onClick={handleLike} icon={ post.likes.includes(currentUser._id) ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteIcon />}/>
  )
}

export default PostLike