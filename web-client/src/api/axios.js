import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosPublic=axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});