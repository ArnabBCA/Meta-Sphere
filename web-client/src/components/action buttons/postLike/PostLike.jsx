import React from 'react'
import axios from '../../../api/axios'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch } from 'react-redux';
import { setPost,openSnackbar } from '../../../state';
import StyledIconButton from '../../styled Components/CustomIconButton';

const PostLike = ({post,currentUser,token}) => {
    const dispatch=useDispatch();
    const handleLike=async()=>{
      try {
        const res = await axios.put(`/posts/${post._id}/like`, {
          userId: currentUser._id,
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          },
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