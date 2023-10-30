import React, { useState } from 'react';
import styles from './CustomUpdatePostModal.module.scss';
import StyledIconButton from './CustomIconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PreviewImage from '../utils/PreviewImage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { openSnackbar, setPost } from '../state';

const CustomUpdatePostModal = ({ setOpenCustomUpdateModal, post, currentUser, token }) => {

  const dispatch=useDispatch();
  const theme=useSelector((state)=>state.theme);

  const [postDesc, setPostDesc] = useState(post.desc || '');
  const [previewImage,setPreviewImage]=useState('');
  const [base64Image, setBase64Image] = useState(null);

    const updatePost=async()=>{
      try {
        if((!postDesc || postDesc===post.desc)  && !base64Image) return;

        const res = await axios.patch(`http://localhost:5000/api/posts/${post._id}`, {
          userId:currentUser._id,
          ...(postDesc && { desc: postDesc }),
          ...(base64Image && { image: base64Image }),
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          },
        });
        dispatch(setPost({post:res.data}));

        setOpenCustomUpdateModal(false);
        dispatch(openSnackbar({message:"Post Updated Successfully",severity:"success"}));
      } catch (error) {
        console.log(error);
        dispatch(openSnackbar({message:"Failed to Update Post",severity:"error"}));
      }
    }
  return (
    <div className={`${styles.updateModalBackground} ${styles[theme]}`}>
      <div className={styles.updateModalContainer}>
        <div className={styles.postInput}>
          <div className={styles.modalHeader}>
            <span>Edit Post</span>
            <StyledIconButton onClick={()=>setOpenCustomUpdateModal(false)} icon={<CloseRoundedIcon />} />
          </div>
          <textarea type="text" value={postDesc} placeholder='Add Description' onChange={e=>setPostDesc(e.target.value)} />
          <input style={{display:"none"}} type="file" accept='image/*' name='image' id='image' onChange={(e)=>setPreviewImage(e.target.files[0])}/>
          <label htmlFor='image'>
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
            <button type='button' onClick={()=>setOpenCustomUpdateModal(false)}>Cancel</button>
            <button type='button'onClick={updatePost}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomUpdatePostModal;
