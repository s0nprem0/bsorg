import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import NavBar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/ui/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';

const Home = lazy(() => import('@/pages/Home'));
const OrganizationProfile = lazy(() => import('@/pages/OrganizationProfile'));
const OrgBrowser = lazy(() => import('@/pages/OrgBrowser'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
  </div>
);

function AutoScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <AutoScrollToTop />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <NavBar />
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/org" element={<OrgBrowser />} />
                <Route path="/org/:slug" element={<OrganizationProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <ScrollToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
