import React from 'react'
import styles from './Explore.module.scss'
import Feed from '../../components/feed/Feed'
import NavBar from '../../components/navbar/NavBar'

const Explore = () => {
  return (
    <>
    <NavBar />
    <div className={styles.explore}>
      <div className={styles.exploreContainer}>
        <Feed page="explore" />
      </div>
    </div>
    </>
  )
}

export default Explore