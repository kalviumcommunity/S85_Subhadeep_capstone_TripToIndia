import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { BrowserRouter } from "react-router-dom";
import {GoogleOAuthProvider} from '@react-oauth/google'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="w-full h-full">
         <App />
        </div>
      </PersistGate>
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)
