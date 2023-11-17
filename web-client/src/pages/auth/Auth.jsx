import React, { useEffect, useState } from 'react';
import styles from './Auth.module.scss';
import Register from './Register';
import Login from './Login';
import { useParams } from 'react-router-dom';
import EarthCanvas from '../../components/globe/Globe';

const Auth = () => {
    const { page } = useParams();
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(1);

    const handleScroll = () => {
        const scrollDiv = document.getElementById('scrollDiv');
        const scrollDivHeight = scrollDiv.scrollHeight - scrollDiv.clientHeight;
        const newOpacity = 1 - (scrollDiv.scrollTop / scrollDivHeight *1.5 );
        const newScale = 1 + (scrollDiv.scrollTop / (scrollDivHeight));
        setOpacity(newOpacity);
        setScale(newScale);
    };

    useEffect(() => {
        const scrollDiv = document.getElementById('scrollDiv');
        scrollDiv.addEventListener('scroll', handleScroll);
        return () => {
            scrollDiv.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div id='scrollDiv' className={styles.authBackground}>
            <div className={styles.logo}>
                <h1 id='logo' style={{ opacity: `${opacity}`, transform: `scale(${scale})` }}>Meta Sphere</h1>
                <div className={styles.scrollIcon}>
                    <div className={styles.wheel}></div>
                    <div className={styles.arrowBox}>
                        <div className={styles.arrow}></div>
                        <div className={styles.arrow}></div>
                        <div className={styles.arrow}></div>
                    </div>
                </div>
            </div>
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
