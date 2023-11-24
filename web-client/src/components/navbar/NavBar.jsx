import React, { useEffect, useState } from 'react'
import styles from './NavBar.module.scss'

import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import Explore from '@mui/icons-material/Explore';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '../../assets/account.png'

import { useDispatch,useSelector } from 'react-redux';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import { setTheme } from '../../state';

import StyledIconButton from '../styled Components/CustomIconButton';
import FollowUser from '../action buttons/FollowUser';
import AccountMenu from './AccountMenu';
import Logout from '../logout/Logout'

const NavBar = () => {
    const axiosPrivate=useAxiosPrivate();
    const theme=useSelector((state)=>state.theme);
    const currentUser=useSelector((state)=>state.currentUser);
    const dispatch=useDispatch();

    const [searchUser,setSearchUser]=useState('');
    let [searchResult,setSearchResult]=useState([]);
    const [openLogoutModal,setOpenLogoutModal]=useState(false);
    const handleSearch = async() => {
        if(searchUser==='') return;
        try {
            const res=await axiosPrivate.get(`/users/search/${searchUser}`);
            setSearchResult(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handleSearch();
    }, [searchUser])

    const handleTheme=()=>{
        document.body.style.transition = "background-color 0.5s";
        dispatch(setTheme());
    }
    return (
        <>
        <div className={`${styles.navBarGap} navbarBackground`}>
            <div className={`${styles.navBar} wigetPrimary`}>
                <div className={styles.navBarContainer}>
                        <div className={styles.navBarLogo}>
                            <Link to='/'>Meta Sphere</Link>
                            <div className={styles.searchContainer}>
                                <div className={`${styles.navSearchBar} wigetSecondary`}>
                                    <input className='primaryText' type="text" placeholder="Search User.." name='search' onChange={(e)=>setSearchUser((e.target.value).trim())}/>
                                    <SearchIcon/>
                                </div>
                                <div className={styles.hamburger}>
                                    <AccountMenu setOpenLogoutModal={setOpenLogoutModal}/>  
                                </div>
                            </div>
                        </div>
                    <div className={styles.navLinks} >
                        <StyledIconButton onClick={handleTheme} icon={theme==="dark"?<LightModeIcon/>:<DarkModeIcon/>}/>
                        <Link to='/'><StyledIconButton icon={<HomeIcon/>}/></Link>
                        <Link to='/explore'><StyledIconButton icon={<Explore/>}/></Link>
                        <StyledIconButton  icon={<LogoutIcon/>} onClick={()=>setOpenLogoutModal(true)}/>
                        <Link to={`/profile/${currentUser._id}`}><StyledIconButton icon={<img style={{height:'22px',width:'22px',borderRadius:"50%",objectFit:'cover'}} src={currentUser.profilePicture.url} alt="" />}/></Link>
                    </div>
                </div> 
            </div>
        </div>
        {searchUser && <div className={styles.searchResultBackground}>
            <div className={`${styles.searchResultContainer} wigetSecondary`}>
            {searchResult.length!=0 ? searchResult.map((user)=>(
                <div className={styles.userConatainer} key={user.userId}>
                    <Link to={`/profile/${user.userId}`}>
                        <div className={styles.userBox}>
                            <img src={user.profilePicture ? user.profilePicture : Avatar} alt="" />
                            <div className={styles.userInfo}>
                                <span className='primaryText'>@{user.userName}</span>
                                <span className='secondaryText'>{user.fullName}</span>
                            </div>
                        </div>
                    </Link>
                    <FollowUser userId={user.userId} currentUser={currentUser}/>
                </div>
            )):<span className={'secondaryText'} style={{fontSize:"14px"}}>No user found.</span>}
            </div>
        </div>}
        {openLogoutModal && <Logout setOpenLogoutModal={setOpenLogoutModal}/> }
        </>
    )
}

export default NavBar