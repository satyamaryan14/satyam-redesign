import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StatisticsPage from './pages/StatisticsPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

// We create a separate component for routes so we can use the useNavigate hook
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<StatisticsPage />} />
      
      <Route path="/login" element={
        <LoginPage 
          onLogin={() => navigate('/')} 
          onSignUp={() => navigate('/register')}
          onForgotPassword={() => alert("Forgot password flow would go here!")}
        />
      } />
      
      <Route path="/register" element={
        <RegistrationPage 
          onSuccess={() => navigate('/login')} 
        />
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container font-sans">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;