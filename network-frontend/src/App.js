import LoginPage from './pages/LoginPage';
import Update from './pages/Update';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GeneralProvider } from './context/GeneralContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {


  return (
    <Router>
        <AuthProvider>
          <GeneralProvider>
            <GoogleOAuthProvider clientId='1076473623293-2d9b46feraupikqta827c3hc9ej320f1.apps.googleusercontent.com'>
            <Routes>
                <Route element={<Update />} path='/*' />
                <Route element={<LoginPage />} path='/login'/>
            </Routes>
            </GoogleOAuthProvider>
          </GeneralProvider>
        </AuthProvider>
    </Router>
      
  );
}

export default App;
