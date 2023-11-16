import React, { useState } from 'react'
import styles from './FindPost.module.scss'
import NavBar from '../../components/navbar/NavBar'
import Feed from '../../components/feed/Feed'
import { useParams } from 'react-router-dom'
const FindPost = () => {
    const {postId}=useParams();
  return (
    <div>
        <NavBar/>
        <div className={styles.findPost}>
            <div className={styles.postContainer}>
                <Feed page={"findPost"} postId={postId}/>
            </div>
        </div>
    </div>
  )
}

export default FindPost