import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';

const CustomSnackbar = ({ open, onClose, severity, message }) => {
  const snackbar = useSelector((state) => state.snackbar);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      key={snackbar.openCounter}
    >
      <Alert onClose={onClose} variant="filled" severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;

