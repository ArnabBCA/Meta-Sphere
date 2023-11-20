import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';

const PersistLogin = () => {
    const [isLoading,setIsLoading]=useState(true);
    const token=useSelector((state)=>state.token);
    const refresh=useRefreshToken();

    const verifyRefreshToken=async()=>{
        try {
            await refresh();
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
    };
    useEffect(()=>{
        if(token){
            setIsLoading(false);
        }
        else{
            verifyRefreshToken();
        }
    },[]);

    return (
        <>
            {isLoading ? (
                <div style={{width:"100%",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <CircularProgress/>
                </div>
            ):(
                <Outlet />
            )}
        </>
    )
};

export default PersistLogin;