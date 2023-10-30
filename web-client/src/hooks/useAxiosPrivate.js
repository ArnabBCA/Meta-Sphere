import { axiosPrivate } from "../api/axios";
import  useRefreshToken  from "./useRefreshToken";
import { useSelector } from "react-redux";

export const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const token=useSelector((state)=>state.token);
    axiosPrivate.interceptors.request.use(
        config => {
            if(!config.headers['Authorization']){
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },(error) => Promise.reject(error)
    );
    axiosPrivate.interceptors.response.use(
        response => response,
        async (error) =>{
            const prevRequest = error?.config;
            if(error?.response?.status === 403 && !prevRequest.sent){
                prevRequest.sent = true;
                const newToken = await refresh();
                prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axiosPrivate(prevRequest);
            }
            return Promise.reject(error);
        }
    );
    return axiosPrivate;
};

export default useAxiosPrivate;