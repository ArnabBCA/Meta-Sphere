import React, { useEffect, useState } from 'react'
import styles from './NavBar.module.scss'

import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '../../assets/account.png'

import { useDispatch,useSelector } from 'react-redux';
import AccountMenu from './AccountMenu';
import axios from 'axios';

import { setTheme } from '../../state';
import StyledIconButton from '../styled Components/CustomIconButton';
import FollowUser from '../action buttons/FollowUser';

const NavBar = () => {
    const theme=useSelector((state)=>state.theme);
    const token=useSelector((state)=>state.token);
    const currentUser=useSelector((state)=>state.currentUser);
    const dispatch=useDispatch();

    const [searchUser,setSearchUser]=useState('');
    let [searchResult,setSearchResult]=useState([]);
    const handleSearch = async() => {
        if(searchUser==='') return;
        try {
            const res=await axios.get(`http://localhost:5000/api/users/search/${searchUser}`,{
                headers: {
                    Authorization: 'Bearer ' + token
                },
            })
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
                            <span>Meta Sphere</span>
                            <div className={styles.searchContainer}>
                                <div className={`${styles.navSearchBar} wigetSecondary`}>
                                    <input className='primaryText' type="text" placeholder="Search User.." name='search' onChange={(e)=>setSearchUser((e.target.value).trim())}/>
                                    <SearchIcon/>
                                </div>
                                <div className={styles.hamburger}>
                                    <AccountMenu/>  
                                </div>
                            </div>
                        </div>
                    <div className={styles.navLinks} >
                        <StyledIconButton onClick={handleTheme} icon={theme==="dark"?<LightModeIcon/>:<DarkModeIcon/>}/>
                        <StyledIconButton icon={<HomeIcon/>}/>
                        <StyledIconButton  icon={<AccountCircleIcon/>}/>
                        <StyledIconButton  icon={<LogoutIcon/>}/>
                    </div>
                </div> 
            </div>
        </div>
        {searchUser && <div className={styles.searchResultBackground}>
            <span className='primaryText'>Search result for "{searchUser}".</span>
            <div className={`${styles.searchResultContainer} wigetSecondary`}>
            {searchResult.length!=0 ? searchResult.map((user)=>(
                <div className={styles.userConatainer} key={user._id}>
                    <div className={styles.userBox}>
                        <img src={user.profilePicture ? user.profilePicture : Avatar} alt="" />
                        <div className={styles.userInfo}>
                            <span className='primaryText'>@{user.userName}</span>
                            <span className='secondaryText'>{user.fullName}</span>
                        </div>
                    </div>
                    <FollowUser userId={user._id} currentUser={currentUser} token={token}/>
                </div>
            )):<span className={'secondaryText'} style={{fontSize:"14px"}}>No user found.</span>}
            </div>
        </div>}
        </>
    )
}

export default NavBar