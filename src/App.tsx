import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import AcademicOrg from '@/pages/AcademicOrg';
import NonAcademicOrg from '@/pages/NonAcademicOrg';
import College from '@/pages/College';
import Pag from '@/pages/Pag';
import OrganizationProfile from '@/pages/OrganizationProfile';
import OrgBrowser from '@/pages/OrgBrowser';
import NavBar from '@/components/layout/Navbar';

function App() {
  return (
    <Router>
      <div className='min-h-screen flex flex-col'>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organization/acad-org" element={<AcademicOrg />} />
          <Route path="/organization/non-acadorg" element={<NonAcademicOrg />} />
          <Route path="/college" element={<College />} />
          <Route path="/pag" element={<Pag />} />
          <Route path="/organization" element={<OrgBrowser />} />
          <Route path="/organization/:slug" element={<OrganizationProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
