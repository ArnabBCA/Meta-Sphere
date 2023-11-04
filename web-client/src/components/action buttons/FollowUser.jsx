import React from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Button } from '@mui/material'
import { useDispatch,useSelector } from 'react-redux'
import { updateCurrentUser,openSnackbar } from '../../state'

const FollowUser = ({userId,currentUser,token}) => {
  const dispatch = useDispatch();
  const axiosPrivate=useAxiosPrivate();
  const theme=useSelector((state)=>state.theme);
  const handelFollow=async()=>{
    try {
      const res = await axiosPrivate.put(`/users/${userId}`, {
      userId: currentUser._id,
    });
      dispatch(updateCurrentUser({currentUser:res.data,}));

      dispatch(openSnackbar({message: currentUser.following.includes(userId)
        ? "User Unfollowed"
        : "User Followed",
      severity: "success"}));

    } catch (error) {
      console.log(error);
      dispatch(openSnackbar({message: currentUser.following.includes(userId)
        ? "Faied to Unfollow User"
        : "Failed to follow User",
      severity: "error"}));
    }
  }
  return (
    <>
      <Button onClick={handelFollow} variant="contained" sx={{
          backgroundColor: theme === 'dark' ? 'var(--lightWigetPrimary)' : 'var(--darkWigetPrimary)',
          borderRadius: "20px",
          transition:".5s",
          color: theme === 'dark' ? 'black' : 'white',
          fontSize: "12px",
          textTransform: 'none',
          fontWeight: '600',
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: theme === 'dark' ? 'var(--lightWigetPrimary)' : 'var(--darkWigetPrimary)',
            color: theme === 'dark' ? 'black' : 'white',
          }
        }}
        >{currentUser.following.includes(userId)?"Following":"Follow"}</Button>  {/* for follow */}
    </>
  )
}

export default FollowUser