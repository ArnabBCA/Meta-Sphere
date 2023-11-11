import React from 'react';
import styles from './Auth.module.scss';
import Register from './Register';
import Login from './Login';
import { useParams } from 'react-router-dom';
import EarthCanvas from '../../components/globe/Globe';

const Auth = () => {
    const { page } = useParams();
    return (
        <div className={styles.authBackground}>
            <div className={styles.authContainer}>
                <div className={styles.conatinerBox}>
                    <EarthCanvas />
                    {page === 'register' ? <Register /> : <Login />}
                </div>
            </div>
        </div>
    );
};
export default Auth;
