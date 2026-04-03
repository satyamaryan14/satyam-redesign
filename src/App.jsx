import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkshopHome from './pages/WorkshopHome';
import WorkshopDetail from './pages/WorkshopDetail'; 
import BookingForm from './pages/BookingForm';

function App() {
  return (
    <Router>
      <div className="app-container font-sans">
        <Routes>
          <Route path="/" element={<WorkshopHome />} />
          <Route path="/workshop/:id" element={<WorkshopDetail />} />
          <Route path="/book/:id" element={<BookingForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 