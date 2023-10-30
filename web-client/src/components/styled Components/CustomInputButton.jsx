import React from 'react';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const CustomInputButton = styled(Button)(({ theme }) => ({
    transition: '0.5s',
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '14px',   
    color: theme==="dark" ? 'var(--darkTextPrimary)' : 'var(--lightTextPrimary)',
    backgroundColor: theme==="dark" ? 'var(--darkIcon)' : 'var(--lightIcon)',
    fontFamily: 'inherit',
    '&:hover, &.Mui-focusVisible': { backgroundColor: theme==="dark"? "var(--darkIcon)" : "var(--lightIcon)" },
}));

const StyledInputButton = ({ icon,text,onClick }) => {
  const theme = useSelector((state) => state.theme);
  return (
    <CustomInputButton variant="contained" startIcon={icon}  theme={theme} onClick={onClick}>
        {text}
    </CustomInputButton>
  );
};

export default StyledInputButton;