import React, { useState } from 'react'
import StyledIconButton from '../../styled Components/CustomIconButton'
import EditIcon from '@mui/icons-material/Edit';
import UpdatePostModal from '../../feed/updatePostModal/UpdatePostModal';
const PostEdit = ({post,posts,setPosts}) => {
    const [openUpdateModal,setOpenUpdateModal]=useState(false);
  return (
    <>
        <StyledIconButton onClick={()=>setOpenUpdateModal(true)} icon={<EditIcon/>}/>
        {openUpdateModal && <UpdatePostModal post={post} posts={posts} setPosts={setPosts} setOpenUpdateModal={setOpenUpdateModal}/>}
    </>
  )
}

export default PostEdit