import React, { useState } from 'react';
import styles from './UpdatePostModal.module.scss';
import StyledIconButton from '../../styled Components/CustomIconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PreviewImage from '../../styled Components/PreviewImage'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector,useDispatch } from 'react-redux';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { openSnackbar, setPost } from '../../../state';
import ModalWrapper from '../../styled Components/modal wrapper/ModalWrapper';

const UpdatePostModal = ({ setOpenUpdateModal, post, currentUser}) => {

  const dispatch=useDispatch();
  const axiosPrivate=useAxiosPrivate();
  const theme=useSelector((state)=>state.theme);

  const [postDesc, setPostDesc] = useState(post.desc || '');
  const [previewImage,setPreviewImage]=useState('');
  const [base64Image, setBase64Image] = useState(null);

    const updatePost=async()=>{
      try {
        if((!postDesc || postDesc===post.desc)  && !base64Image) return;

        const res = await axiosPrivate.patch(`/posts/${post._id}`, {
          userId:currentUser._id,
          ...(postDesc && { desc: postDesc }),
          ...(base64Image && { image: base64Image }),
        });
        dispatch(setPost({post:res.data}));

        setOpenUpdateModal(false);
        dispatch(openSnackbar({message:"Post Updated Successfully",severity:"success"}));
      } catch (error) {
        console.log(error);
        dispatch(openSnackbar({message:"Failed to Update Post",severity:"error"}));
      }
    }
  return (
    <ModalWrapper width={"400px"} setModalOpen={setOpenUpdateModal}>
        <div className={styles.modalHeader}>
            <span className='primaryText'>Edit Post</span>
            <StyledIconButton onClick={()=>setOpenUpdateModal(false)} icon={<CloseRoundedIcon />} />
        </div>
        <textarea type="text" className='bgInput' value={postDesc} placeholder='Add Description' onChange={e=>setPostDesc(e.target.value)} />
        <input style={{display:"none"}} type="file" accept='image/*' name='image' id='image' onChange={(e)=>setPreviewImage(e.target.files[0])}/>
        <label htmlFor='image' style={{width:"100%"}}>
            <div className={styles.photoContainer}>
              {post.image || previewImage ? <div className={styles.hoverChangeImage}>
                <span>Change Image</span>
              </div> : null}
              {post.image && !previewImage ? <img src={post.image.url}alt="" /> : previewImage ? <PreviewImage base64Image={base64Image} setBase64Image={setBase64Image} image={previewImage}/> : 
                <div className={styles.uploadImage}>
                  <CloudUploadIcon style={{fontSize:"50px",color:"#07D2FC"}}/>
                  <span className={"globalIcons"+theme}>Upload Image</span>
                </div>}
            </div>
        </label>
        <div className={styles.updateActions}>
            <button type='button' onClick={()=>setOpenUpdateModal(false)}>Cancel</button>
            <button type='button'onClick={updatePost}>Update</button>
        </div>
    </ModalWrapper>
  );
};

export default UpdatePostModal;