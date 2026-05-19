import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import AcademicOrg from '@/pages/AcademicOrg';
import NonAcademicOrg from '@/pages/NonAcademicOrg';
import College from '@/pages/College';
import OrganizationProfile from '@/pages/OrganizationProfile';
import OrgBrowser from '@/pages/OrgBrowser';
import NavBar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <div className='min-h-screen flex flex-col bg-background text-foreground'>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organization/acad-org" element={<AcademicOrg />} />
          <Route path="/organization/non-acadorg" element={<NonAcademicOrg />} />
          <Route path="/college" element={<College />} />
          <Route path="/organization" element={<OrgBrowser />} />
          <Route path="/organization/:slug" element={<OrganizationProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        <Footer />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;