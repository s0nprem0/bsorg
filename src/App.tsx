import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import NavBar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/ui/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';

const Home = lazy(() => import('@/pages/Home'));
const Directory = lazy(() => import('@/pages/Directory'));
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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<ErrorBoundary key="home"><Home /></ErrorBoundary>} />
              <Route path="/org" element={<ErrorBoundary key="org"><OrgBrowser /></ErrorBoundary>} />
              <Route path="/directory" element={<ErrorBoundary key="directory"><Directory /></ErrorBoundary>} />
              <Route path="/org/:slug" element={<ErrorBoundary key="profile"><OrganizationProfile /></ErrorBoundary>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <ScrollToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
