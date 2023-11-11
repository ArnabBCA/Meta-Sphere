import React, { useRef, useState } from 'react'
import styles from './CreateStoryModal.module.scss'
import StyledIconButton from '../../styled Components/CustomIconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PreviewImage from '../../styled Components/PreviewImage';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import { IconButton } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import gradients from './gradients.json';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { openSnackbar,setStories } from '../../../state'
import ModalWrapper from '../../styled Components/modal wrapper/ModalWrapper';
import CircularProgress from '@mui/material/CircularProgress';

const CreateStoryModal = ({ setOpenCreateStoryModal, story, currentUser, token,setNewStoryCreated,openCreateStoryModal }) => {
  const fileInputRef = useRef(null);
  const dispatch=useDispatch();
  const axiosPrivate=useAxiosPrivate();
  const stories=useSelector((state)=>state.stories);
  const [loading,setLoading]=useState(false);

  const [storyText,setStoryText]=useState('');
  const [currentGradient,setCurrentGradient]=useState(null);

  const [previewImage,setPreviewImage]=useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const handleStoryText=(e)=>{
    setStoryText(e.target.value);
    if(e.target.value===''){
      document.getElementById('#storySpan').textContent="#Add Your Story"
    }
    else{
      document.getElementById('#storySpan').textContent=e.target.value;
    }
  }
  const handleGradient=()=>{
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    setCurrentGradient(randomGradient.colors);
  }
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const updateFirstStorySlides = (newSlideData) => {
    // Make a copy of the first story in the stories array
    const firstStory = { ...stories[0] };
    // Make a copy of the existing storySlides array or initialize it as an empty array
    const updatedSlides = firstStory.storySlides ? [...firstStory.storySlides] : [];
    // Insert newSlideData at the last index of the updatedSlides array
    updatedSlides.push(newSlideData);
    // Update the first story with the updated storySlides array
    firstStory.storySlides = updatedSlides;
    // Create a copy of the existing stories array
    const updatedStories = [...stories];
    // Replace the first story in the updatedStories array with the updated firstStory
    updatedStories[0] = firstStory;
    return updatedStories;
  };

  const handleStoryPost=async()=>{
    try {
      setLoading(true);
      const res = await axiosPrivate.post('/stories',{
        image:base64Image,
        creatorId:currentUser._id,
        desc:storyText,
        color1:currentGradient[0],
        color2:currentGradient[1],
      });
      if(res.data.userName){
        dispatch(setStories({
          stories: stories.concat(res.data),
        }));      
      }
      else{
        const updatedStories = updateFirstStorySlides(res.data);
        dispatch(setStories({
            stories:updatedStories
        }));
      }
      setLoading(false);
      setNewStoryCreated(true);

      dispatch(openSnackbar({message:"Story Created Successfully",severity:"success"}));
      setOpenCreateStoryModal(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
      dispatch(openSnackbar({message:"Failed To Create Story",severity:"error"}));
    }
  }
  return (
    <ModalWrapper width={"300px"} setModalOpen={setOpenCreateStoryModal}>
      <div className={styles.modalHeader}>
        <span className='primaryText'>Create Story</span>
        <StyledIconButton onClick={()=>setOpenCreateStoryModal(false)} icon={<CloseRoundedIcon/>} />
      </div>
      <div className={styles.storyContainer} style={currentGradient && { background: `linear-gradient(to right, ${currentGradient[0]}, ${currentGradient[1]})`}}>
        <div className={styles.storyButtons}>
          <input ref={fileInputRef} style={{display:"none"}} type="file" accept='image/*' name='image' id='image' onChange={(e)=>setPreviewImage(e.target.files[0])}/>
          <label htmlFor='image'>
            <IconButton onClick={handleButtonClick}  size="small" sx={{ backgroundColor: 'blue', '&:hover, &.Mui-focusVisible': { backgroundColor: 'blue' } }}>
              <AddPhotoAlternateRoundedIcon sx={{color:"white"}}/>
            </IconButton>
          </label>
          <IconButton onClick={handleGradient} size="small" sx={{ background: 'linear-gradient(to right,yellow, red, purple)' }}>
            <ColorLensRoundedIcon sx={{color:"white"}}/>
          </IconButton>
        </div>
        {previewImage && <PreviewImage base64Image={base64Image} setBase64Image={setBase64Image} image={previewImage}/>}
        <div className={styles.text}>
          <span id='#storySpan'>#Add Your Story</span>
        </div>
        <input type="text" placeholder='#Add Your Story' onChange={handleStoryText}/>
      </div>
      <svg style={{visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="instagram">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>    
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo"></feColorMatrix>
            <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
          </filter>
        </defs>
      </svg>
      <div className={styles.updateActions}>
        <button type='button' onClick={()=>setOpenCreateStoryModal(false)}>Cancel</button>
        <button type='button' onClick={handleStoryPost}>{loading ? <CircularProgress size={20}/>:"Post"}</button>
      </div>
    </ModalWrapper>
  )
}

export default CreateStoryModal