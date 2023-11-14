import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from '../../../state';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

import StyledIconButton from '../../styled Components/CustomIconButton'
import DeletePostModal from '../../feed/deletePostModal/DeletePostModal';

const PostDelete = ({post,posts,setPosts}) => {
    const dispatch=useDispatch();
    const axiosPrivate=useAxiosPrivate();
    const currentUser=useSelector((state)=>state.currentUser);
    const [openDeletePostModal,setOpenDeletePostModal]=useState(false);

    const handleDelete=async()=>{
      try {
        const res = await axiosPrivate.delete(`/posts/${post._id}`, {
          data: {
            userId: currentUser._id,
          },
        });
        setPosts(posts.filter((p) => p._id !== post._id));

        dispatch(openSnackbar({message:"Post Deleted",severity:"success"}));
      } catch (error) {
        console.log(error);
        dispatch(openSnackbar({message:"Failed to Delete Post",severity:"error"}));
      }
    }
  return (
    <>
      <StyledIconButton onClick={()=>setOpenDeletePostModal(true)} icon={<DeleteIcon style={{color:"orange"}}/>}/>
      {openDeletePostModal && <DeletePostModal setOpenDeletePostModal={setOpenDeletePostModal} handleDelete={handleDelete}/>}
    </>
  )
}

export default PostDelete