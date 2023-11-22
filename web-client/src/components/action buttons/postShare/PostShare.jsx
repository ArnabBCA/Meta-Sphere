import React, { useState } from 'react';
import styles from './PostShare.module.scss';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import StyledIconButton from '../../styled Components/CustomIconButton';

const PostShare = ({post}) => {
  const [copied, setCopied] = useState(false);
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.host}/post/${post._id}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  return (
    <div className={`${styles.postShare} wigetSecondary`}>
        <input className='secondaryText' type="text" value={`${window.location.host}/post/${post._id}`} disabled/>
        <StyledIconButton onClick={handleCopyToClipboard} icon={copied ? <CheckCircleOutlineRoundedIcon style={{color:"green"}}/> : <ContentCopyIcon/>}/>
    </div>
  )
}

export default PostShare