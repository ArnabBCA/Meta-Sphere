import React, { useState } from 'react'
import styles from './ProfileModal.module.scss'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PreviewImage from '../../styled Components/PreviewImage';
import NoProfilePic from '../../../assets/account.png'
import CircularProgress from "@mui/material/CircularProgress";

import {useAxiosPrivate} from '../../../hooks/useAxiosPrivate';
import {useFormik} from 'formik'

import { profileSchema,initialValues } from '../../../schemas/Schemas';

import { updateCurrentUser,openSnackbar } from '../../../state';
import { useDispatch,useSelector } from 'react-redux';
import StyledIconButton from '../../styled Components/CustomIconButton';
import ModalWrapper from '../../styled Components/modal wrapper/ModalWrapper';

const ProfileModal = ({setProfileModal}) => {
    const dispatch = useDispatch();
    const axiosPrivate=useAxiosPrivate();
    
    const currentUser=useSelector((state)=>state.currentUser);
    const [previewImage, setPreviewImage] = useState("");
    const [base64Image, setBase64Image] = useState("");
    const [loading, setLoading] = useState(false);

    const {values,errors,touched,handleBlur,handleChange,handleSubmit,resetForm}=useFormik({
      initialValues:initialValues,
      validationSchema:profileSchema,
      onSubmit : async (values)=>{
        if(!values.fullName && !values.location && !values.occupation && !values.socialLink1 && !values.socialLink2 && !base64Image) return;
        try{
          setLoading(true);
          const res = await axiosPrivate.patch(`/users/${currentUser._id}`, {
            userId:currentUser._id,
            ...(base64Image && { profilePicture: base64Image }),
            ...(values.fullName && { fullName: values.fullName }),
            ...(values.location && { location: values.location }),
            ...(values.occupation && { occupation: values.occupation }),
            ...(values.socialLink1 && { socialLink1: values.socialLink1 }),
            ...(values.socialLink2 && { socialLink2: values.socialLink2 }),
          });
          dispatch(updateCurrentUser({
            currentUser:res.data,
          }));
          resetForm();
          setProfileModal(false);
          setPreviewImage("");
          setBase64Image("");

          dispatch(openSnackbar({message:"Profile Updated Successfully",severity:"success"}));
        }catch(error){
          console.log(error);
          dispatch(openSnackbar({message:"Failed to Update Profile",severity:"error"}));
        }
        finally{
          setLoading(false);
        }
      }
    });
    
  return (
    <ModalWrapper width={"300px"} setModalOpen={setProfileModal}>
        <div className={styles.modalHeader}>
          <span className='primaryText'>Update Profile</span>
          <StyledIconButton icon={<CloseRoundedIcon/>} onClick={()=>setProfileModal(false)}/>
        </div>
        <div className={styles.profilePicture}>
          <input style={{display:"none"}} onChange={e=>setPreviewImage(e.target.files[0])} type="file" accept='image/*' name='profilePicture' id='profilePicture'/>
          <label htmlFor='profilePicture'>
            {previewImage ? <PreviewImage base64Image={base64Image} setBase64Image={setBase64Image} image={previewImage}/> : <img src={NoProfilePic} alt="avatar" />}
          </label>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input className='wigetSecondary primaryText' type="text" autoComplete='off' name='fullName' placeholder='Full Name' value={values.fullName} onChange={handleChange} onBlur={handleBlur}/>
            {errors.fullName && touched.fullName ? <span className={styles.error}>{errors.fullName}</span> : null}
          </div>
          <div className={styles.inputBox}>
            <input className='wigetSecondary primaryText' type="text" autoComplete='off' name='location' placeholder='Location' value={values.location} onChange={handleChange} onBlur={handleBlur}/>
            { errors.location && touched.location  ? <span className={styles.error}>{errors.location}</span> : null}
          </div>
          <div className={styles.inputBox}>
            <input className='wigetSecondary primaryText' type="text" autoComplete='off' name='occupation' placeholder='Occupation' value={values.occupation} onChange={handleChange} onBlur={handleBlur}/>
            { errors.occupation && touched.occupation  ? <span className={styles.error}>{errors.occupation}</span> : null}
          </div>
          <div className={styles.inputBox}>
            <input className='wigetSecondary primaryText' type="text" autoComplete='off' name='socialLink1' placeholder='Social Link 1' value={values.socialLink1} onChange={handleChange} onBlur={handleBlur}/>
            { errors.socialLink1 && touched.socialLink1  ? <span className={styles.error}>{errors.socialLink1}</span> : null}
          </div>
          <div className={styles.inputBox}>
            <input className='wigetSecondary primaryText'  type="text" autoComplete='off' name='socialLink2' placeholder='Social Link 2' value={values.socialLink2} onChange={handleChange} onBlur={handleBlur}/>
            { errors.socialLink2 && touched.socialLink2  ? <span className={styles.error}>{errors.socialLink2}</span> : null}
          </div>
          <button type='submit'>{loading ? <CircularProgress size={24}/>: "Update Profile"}</button>
        </form>
    </ModalWrapper>
  )
}

export default ProfileModal