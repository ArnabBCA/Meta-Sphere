import React, { useState } from 'react'
import styles from './PostInput.module.scss'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoProfilePic from '../../assets/account.png';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useSelector,useDispatch } from 'react-redux';
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';

import { openSnackbar } from '../../state';
import StyledInputButton from '../styled Components/CustomInputButton';
import WigetWrapper from '../styled Components/wiget wrapper/WegetWrapper';
import PreviewImage from '../styled Components/PreviewImage';
import { Link } from 'react-router-dom';

const PostInput = ({setNewPostCreated}) => {
  const dispatch=useDispatch();
  const axiosPrivate=useAxiosPrivate();
  const currentUser=useSelector((state)=>state.currentUser);

  const theme=useSelector((state)=>state.theme);
  const [loading,setLoading]=useState(false);
  const [previewImage,setPreviewImage]=useState('');
  const [base64Image,setBase64Image]=useState('');
  const [desc,setdesc]=useState('');

  const handleSubmit=async()=>{
    try {
      if(!base64Image && !desc.trim()){
        dispatch(openSnackbar({message:"Post cannot be Empty",severity:"warning"}));
        return;
      }
      setLoading(true);
      const res = await axiosPrivate.post('/posts',{
        image:base64Image,
        creatorId:currentUser._id,
        desc:desc.trim(),
      });
      setNewPostCreated(res.data);

      dispatch(openSnackbar({message:"Post Created",severity:"success"}));

      setPreviewImage('');
      setBase64Image('');
      setdesc('');
    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({message:"Failed to Create Post",severity:"error"}));
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <WigetWrapper>
        <div className={styles.postInput}>
          <Link to={`/profile/${currentUser._id}`}>
            <img src={currentUser.profilePicture ? currentUser.profilePicture.url : NoProfilePic} alt="" />
          </Link>
          <input className='bgInput' type="text" placeholder="What's in your mind? . . ." onChange={(e)=>setdesc(e.target.value)} value={desc} name='post desc'/>
        </div>
        {!base64Image && <div className={"horizontalHr"+theme}/>}
        {previewImage &&  <div className={styles.previewBorder}>
          <PreviewImage base64Image={base64Image} setBase64Image={setBase64Image} image={previewImage}/>
        </div>}
        <div className={styles.postInputOptions}>
          <input style={{display:"none"}} onChange={e=>setPreviewImage(e.target.files[0])} type="file"  accept='image/*' name='file' id='file'/>
          <label htmlFor='file'>
            <StyledInputButton text={"Image"} icon={<AddPhotoAlternateIcon/>} onClick={() => {document.getElementById('file').click();}}/>
          </label>
          <div className={styles.dummyButton1}>
            <StyledInputButton text={"Video"} icon={<PlayCircleOutlineIcon/>}/>
          </div>
          <div className={styles.dummyButton2}>
            <StyledInputButton text={"Attach"} icon={<AttachFileIcon/>}/>
          </div>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontSize: '14px',
              background: 'linear-gradient(to right, #36aee6ed 0%, rgb(131, 66, 212) 100%)',
              color: 'white',
              width: '100px',
              fontFamily: 'inherit',
              '&:hover, &.Mui-focusVisible': {
                background: 'linear-gradient(to right, #36aee6ed 0%, rgb(131, 66, 212) 100%)',
              },
            }}
          >
            {loading ? <CircularProgress sx={{color:"white"}} size={24} /> : "Post"}
          </Button>
        </div>
      </WigetWrapper>
  )
}

export default PostInput