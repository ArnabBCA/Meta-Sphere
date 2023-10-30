import React, { useState } from 'react'
import StyledIconButton from '../../styled Components/CustomIconButton'
import EditIcon from '@mui/icons-material/Edit';
import UpdatePostModal from '../../post/updatePostModal/UpdatePostModal';
const PostEdit = ({post,currentUser,token}) => {
    const [openUpdateModal,setOpenUpdateModal]=useState(false);
  return (
    <>
        <StyledIconButton onClick={()=>setOpenUpdateModal(true)} icon={<EditIcon/>}/>
        {openUpdateModal && <UpdatePostModal post={post} currentUser={currentUser} token={token} setOpenUpdateModal={setOpenUpdateModal}/>}
    </>
  )
}

export default PostEdit