import React from 'react'
import styles from './Explore.module.scss'
import Feed from '../../components/feed/Feed'
import Navbar from '../../components/navbar/Navbar'

const Explore = () => {
  return (
    <>
    <Navbar />
    <div className={styles.explore}>
      <div className={styles.exploreContainer}>
        <Feed page="explore" />
      </div>
    </div>
    </>
  )
}

export default Explore