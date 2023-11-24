import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import authReducer from './state/index.js';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {disableReactDevTools} from '@fvilers/disable-react-devtools';

if(process.env.NODE_ENV === 'production') disableReactDevTools();

const store = configureStore({
  reducer: authReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
