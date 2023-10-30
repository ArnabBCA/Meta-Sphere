import React from 'react';
import { styled } from '@mui/system';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    color: theme==="dark" ? 'var(--darkTextPrimary)' : 'var(--lightTextPrimary)',
    '&:hover, &.Mui-focusVisible': { backgroundColor: theme==="dark"? "var(--darkIcon)" : "var(--lightIcon)" },
    transition: 'color var(--transition',
}));

const StyledIconButton = ({ icon,text,onClick }) => {
  const theme = useSelector((state) => state.theme);
  return (
    <CustomIconButton theme={theme} onClick={onClick}>
      {icon}
      {text && <span>{text}</span>}
    </CustomIconButton>
  );
};

export default StyledIconButton;