import React, { useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deletePost,openSnackbar } from '../../../state';
import StyledIconButton from '../../styled Components/CustomIconButton';
//import CustomConfirmModal from '../../../../../UI elements/CustomConfirmModal';

const PostDelete = ({post,currentUser}) => {
    const dispatch=useDispatch();
    const axiosPrivate=useAxiosPrivate();
    const [openConfirmModal,setOpenConfirmModal]=useState(false);
    const [confirmation,setConfirmation]=useState(false);

    if(openConfirmModal){
      document.body.style.overflow="hidden";
    }
    else{
      document.body.style.overflow="auto";
    }

    const confirmDelete=()=>{
      setOpenConfirmModal(true);
    }
    const handleDelete=async()=>{
      try {
        const res = await axiosPrivate.delete(`/posts/${post._id}`, {
          data: {
            userId: currentUser._id,
          },
        });
        dispatch(deletePost({postId:post._id}));

        dispatch(openSnackbar({message:"Post Deleted",severity:"success"}));
      } catch (error) {
        console.log(error);
        dispatch(openSnackbar({message:"Failed to Delete Post",severity:"error"}));
      }
    }
    if(confirmation){
      handleDelete();
    }
  return (
    <>
      <StyledIconButton onClick={confirmDelete} icon={<DeleteIcon style={{color:"orange"}}/>}/>
      {/*openConfirmModal && <CustomConfirmModal openConfirmModal={openConfirmModal} setConfirmation={setConfirmation} setOpenConfirmModal={setOpenConfirmModal}/>*/}
    </>
  )
}

export default PostDelete