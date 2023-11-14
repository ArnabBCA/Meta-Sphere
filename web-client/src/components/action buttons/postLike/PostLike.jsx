import React from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from '../../../state';
import StyledIconButton from '../../styled Components/CustomIconButton';

const PostLike = ({post,posts,setPosts}) => {
    const dispatch=useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const currentUser=useSelector((state)=>state.currentUser);
    const handleLike=async()=>{
      try {
        const res = await axiosPrivate.put(`/posts/${post._id}/like`, {
          userId: currentUser._id,
        });
        setPosts(posts.map((p) => (p._id === post._id ? res.data : p)));
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