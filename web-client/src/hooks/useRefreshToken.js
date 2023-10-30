import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setLogin } from '../state';

const useRefreshToken = () => {
    const dispatch=useDispatch();
    const refresh=async()=>{
        try {
            const res=await axios.get('http://localhost:5000/api/refresh',{
                withCredentials:true,
            });
            dispatch(setLogin({token: res.data.token}));
            return res.data.token;
        } catch (error) {
            console.log(error);
        }
    }
    return refresh;
}

export default useRefreshToken