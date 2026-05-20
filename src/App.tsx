import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Keep layout components bundled immediately to prevent layout shifts
import NavBar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const AcademicOrg = lazy(() => import('@/pages/AcademicOrg'));
const NonAcademicOrg = lazy(() => import('@/pages/NonAcademicOrg'));
const OrganizationProfile = lazy(() => import('@/pages/OrganizationProfile'));
const OrgBrowser = lazy(() => import('@/pages/OrgBrowser'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Simple fallback while chunks are loading
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className='flex min-h-screen flex-col bg-background text-foreground'>
          <NavBar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/organization/acad-org" element={<AcademicOrg />} />
              <Route path="/organization/non-acadorg" element={<NonAcademicOrg />} />
              <Route path="/organization" element={<OrgBrowser />} />
              <Route path="/organization/:slug" element={<OrganizationProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ScrollToTop />
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;