import { axiosPublic } from '../api/axios';
import { useDispatch } from 'react-redux';

import { setLogin } from '../state';

const useRefreshToken = () => {
    const dispatch=useDispatch();
    const refresh=async()=>{
        try {
            const res=await axiosPublic.get('/refresh');
            dispatch(setLogin({token: res.data.token, currentUser: res.data.currentUser}));
            return res.data.token;
        } catch (error) {
            console.log(error);
        }
    }
    return refresh;
}

export default useRefreshToken