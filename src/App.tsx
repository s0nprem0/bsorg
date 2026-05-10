import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AcademicOrg from './pages/AcademicOrg';
import NonAcademicOrg from './pages/NonAcademicOrg';
import College from './pages/College';
import Pag from './pages/Pag';
import OrganizationProfile from './pages/OrganizationProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acadorg" element={<AcademicOrg />} />
        <Route path="/non-acadorg" element={<NonAcademicOrg />} />
        <Route path="/college" element={<College />} />
        <Route path="/pag" element={<Pag />} />
        <Route path="/organization/:slug" element={<OrganizationProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
