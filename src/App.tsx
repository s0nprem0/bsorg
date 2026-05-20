import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import NavBar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('@/pages/Home'));
const AcademicOrg = lazy(() => import('@/pages/AcademicOrg'));
const NonAcademicOrg = lazy(() => import('@/pages/NonAcademicOrg'));
const OrganizationProfile = lazy(() => import('@/pages/OrganizationProfile'));
const OrgBrowser = lazy(() => import('@/pages/OrgBrowser'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
          <main className="flex-1 flex flex-col">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/org/acad-org" element={<AcademicOrg />} />
                <Route path="/org/non-acadorg" element={<NonAcademicOrg />} />
                <Route path="/org" element={<OrgBrowser />} />
                <Route path="/org/:slug" element={<OrganizationProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <ScrollToTop />
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;