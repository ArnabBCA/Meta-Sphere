import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomScackbar=({ open, onClose, severity, message }) =>{
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert onClose={onClose} variant="filled" severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
export default CustomScackbar
