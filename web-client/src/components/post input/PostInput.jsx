import React, { useState } from 'react'
import styles from './PostInput.module.scss'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoProfilePic from '../../assets/account.png';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useSelector,useDispatch } from 'react-redux';
import { Button } from '@mui/material'

import { setPosts,openSnackbar } from '../../state';
import StyledInputButton from '../styled Components/CustomInputButton';
import WigetWrapper from '../styled Components/wiget wrapper/WegetWrapper';

const PostInput = () => {
  const dispatch=useDispatch();
  const axiosPrivate=useAxiosPrivate();
  const currentUser=useSelector((state)=>state.currentUser);
  const posts=useSelector(state=>state.posts);

  const theme=useSelector((state)=>state.theme);
  const [image,setImage]=useState('');
  const [desc,setdesc]=useState('');
  const handleImage=(e)=>{
    if(e.target.files[0].size > 2200000){
      dispatch(openSnackbar({message:"Maximum image size is 2mb",severity:"info"}));
      return;
    }
    else{
      const file=e.target.files[0];
      setFileToBase(file);
    }
  }
  const setFileToBase=(file)=>{
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      setImage(reader.result);
    }
  }

  const handleSubmit=async()=>{
    if(!image && !desc.trim()){
      dispatch(openSnackbar({message:"Post cannot be Empty",severity:"warning"}));
      return;
    }
    try {
      const res = await axiosPrivate.post('/posts',{
        image:image,
        creatorId:currentUser._id,
        desc:desc.trim(),
      });

      const mergedPosts=[res.data,...posts];
      dispatch(setPosts({
        posts:mergedPosts
      }));
      
      setImage('');
      setdesc('');
      dispatch(openSnackbar({message:"Post Created",severity:"success"}));
    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({message:"Failed to Create Post",severity:"error"}));
    }
  }
  return (
    <WigetWrapper>
        <div className={styles.postInput}>
          {currentUser.profilePicture ? <img src={currentUser.profilePicture.url} alt="" /> : <img src={NoProfilePic} alt=""/>}
          <input className='bgInput' type="text" placeholder="What's in your mind? . . ." onChange={(e)=>setdesc(e.target.value)} value={desc} name='post desc'/>
        </div>
        <div className={"horizontalHr"+theme}></div>
        <div className={styles.postInputOptions}>
          <input style={{display:"none"}} onChange={handleImage} type="file"  accept='image/*' name='file' id='file'/>
          <label htmlFor='file'>
            <StyledInputButton text={"Image"} icon={<AddPhotoAlternateIcon/>} onClick={() => {document.getElementById('file').click();}}/>
          </label>
          <div className={styles.dummyButton1}>
            <StyledInputButton text={"Video"} icon={<PlayCircleOutlineIcon/>}/>
          </div>
          <div className={styles.dummyButton2}>
            <StyledInputButton text={"Attach"} icon={<AttachFileIcon/>}/>
          </div>
          <Button variant="contained" onClick={handleSubmit} sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: '500',
            fontSize: '14px',
            backgroundColor: 'aqua',
            color:'black',
            width:'90px',
            fontFamily: 'inherit',
            '&:hover, &.Mui-focusVisible': { backgroundColor: 'aqua' },
          }}>Post</Button>
        </div>
      </WigetWrapper>
  )
}

export default PostInput