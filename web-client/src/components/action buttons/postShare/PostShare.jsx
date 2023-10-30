import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import StyledIconButton from '../../styled Components/CustomIconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import styles from './PostShare.module.scss';
const PostShare = ({post}) => {
  
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  return (
    <div className={`${styles.postShare} wigetSecondary`}>
        <span className='secondaryText'>{post._id}</span>
        <CopyToClipboard text={post._id} onCopy={handleCopyToClipboard}>
          <StyledIconButton icon={copied ? <CheckCircleOutlineRoundedIcon style={{color:"green"}}/> : <ContentCopyIcon/>}/>
        </CopyToClipboard>
    </div>
  )
}

export default PostShare